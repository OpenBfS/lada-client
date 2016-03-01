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
Ext.define('Lada.view.grid.ProbeList', {
    extend: 'Lada.view.widget.DynamicGrid',
    alias: 'widget.probelistgrid',

    requires: 'Lada.view.window.DeleteProbe',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('probe.emptyGrid');

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                text: i18n.getMsg('probe.gridTitle')
            },
            '->',
            {
                text: i18n.getMsg('probe.button.create'),
                icon: 'resources/img/list-add.png',
                action: 'addProbe',
                disabled: false
            }, {
                text: i18n.getMsg('probe.button.import'),
                icon: 'resources/img/svn-commit.png',
                action: 'import',
                disabled: false
            }, {
                text: i18n.getMsg('probe.button.export'),
                icon: 'resources/img/svn-update.png',
                action: 'export',
                disabled: true //disabled on start, enabled by the controller
            }, {
                text: i18n.getMsg('probe.button.print'),
                icon: 'resources/img/printer.png',
                action: 'print',
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

        columns.push({
            xtype: 'actioncolumn',
            text: i18n.getMsg('action'),
            sortable: false,
            width: 30,
            items: [{
                icon: 'resources/img/edit-delete.png',
                tooltip: i18n.getMsg('delete'),
                isDisabled: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    if ( rec.get('readonly') || !rec.get('owner')) {
                        return true;
                    }
                    return false;
                },
                handler: function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex);

                    var winname = 'Lada.view.window.DeleteProbe';
                    var win = Ext.create(winname, {
                        record: rec,
                        parentWindow: this
                    });
                    win.show();
                    win.initData();
                }
            }]
        });
        this.store.model.setFields(fields);
        this.reconfigure(this.store, columns);
    }
});

