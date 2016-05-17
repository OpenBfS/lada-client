/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list the result of the Filter
 */
Ext.define('Lada.view.grid.MessungList', {
    extend: 'Lada.view.widget.DynamicGrid',
    alias: 'widget.messunglistgrid',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('messung.emptyGrid');
        this.selModel = Ext.create('Ext.selection.CheckboxModel', {
            checkOnly: true
        });

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                text: i18n.getMsg('messung.gridTitle')
            },
            '->',
            {
                text: i18n.getMsg('probe.button.print'),
                icon: 'resources/img/printer.png',
                action: 'print',
                disabled: true //disabled on start, enabled by the controller
            }, {
                text: i18n.getMsg('statusSetzen'),
                icon: 'resources/img/mail-mark-notjunk.png',
                action: 'setstatus',
                disabled: true //disabled on start, enabled by the controller
            }]
        }];
        this.columns = [];
        this.callParent(arguments);
    },

    /**
     * Setup columns of the Grid dynamically based on a list of given cols.
     * The function is called from the {@link Lada.controller.Filter#search
     * search event}
     * The Images for the Read-Write Icon are defined in CSS
     * This Method overrides setupColumns of the parents class,
     * becaus the delete colum is required.
     */
    setupColumns: function(cols) {
        var caf = this.generateColumnsAndFields(cols);
        var columns = caf[0];
        var fields = caf[1];
        var i18n = Lada.getApplication().bundle;

        this.store.model.setFields(fields);
        this.reconfigure(this.store, columns);
    }
});
