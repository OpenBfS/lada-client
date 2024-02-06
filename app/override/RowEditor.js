/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.RowEditor', {
    override: 'Ext.grid.RowEditor',

    requires: [
        'Lada.view.widget.base.SelectableDisplayField'
    ],

    initComponent: function() {
        this.callParent(arguments);
        var button = this.down('button[ui=default-toolbar]');
        while (button) {
            button.setUI('default');
            button = this.down('button[ui=default-toolbar]');
        }
        this.down('button[itemId=update]').setIcon(
            'resources/img/dialog-ok-apply.png');
        this.down('button[itemId=cancel]').setIcon(
            'resources/img/dialog-cancel.png');
    },

    addFieldsForColumn: function(column, initial) {
        var me = this,
            i,
            length, field;

        if (Ext.isArray(column)) {
            for (i = 0, length = column.length; i < length; i++) {
                me.addFieldsForColumn(column[i], initial);
            }
            return;
        }

        if (column.getEditor) {
            // Get a default display field if necessary
            field = column.getEditor(null, {
                xtype: 'selectabledisplayfield',
                // Override Field's implementation so that the default display
                // fields will not return values. This is done because the
                // display field will pick up column renderers from the grid.
                getModelData: function() {
                    return null;
                }
            });
            if (column.align === 'right') {
                field.fieldStyle = 'text-align:right';
            }

            if (column.xtype === 'actioncolumn') {
                field.fieldCls += ' ' +
                    Ext.baseCSSPrefix +
                    'form-action-col-field';
            }

            if (me.isVisible() && me.context) {
                if (field.is('selectabledisplayfield')) {
                    me.renderColumnData(field, me.context.record, column);
                } else {
                    field.suspendEvents();
                    field.setValue(me.context.record.get(column.dataIndex));
                    field.resumeEvents();
                }
            }
            if (column.hidden) {
                me.onColumnHide(column);
            } else if (column.rendered && !initial) {
                // Setting after initial render
                me.onColumnShow(column);
            }
        }
    }
});
