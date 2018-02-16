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

    requires: [
        'Lada.view.window.DeleteMultipleProbe',
        'Lada.view.window.DeleteProbe',
        'Lada.view.window.ProbeCreate'
    ],

    hideCreate: false,
    hideImport: false,
    hideDeleteSelected: false,
    hidePrintSheet: false,

    title: 'probe.gridTitle',
    emptyText: 'probe.emptyGrid',

    toolbarbuttons: [{
        text: 'probe.button.create',
        icon: 'resources/img/list-add.png',
        action: 'addProbe',
        hidden: this.hideCreate,
        disabled: false
    }, {
        text: 'probe.button.import',
        icon: 'resources/img/svn-commit.png',
        action: 'import',
        hidden: this.hideImport,
        disabled: false
    }, {
        text: 'probe.button.delete_selected',
        icon: 'resources/img/edit-delete.png',
        action: 'deleteSelected',
        hidden: this.hideDeleteSelected,
        disabled: true //disabled on start, enabled by the controller
    }, {
        text: 'probe.button.printSheet',
        icon: 'resources/img/printer.png',
        action: 'printSheet',
        hidden: this.hidePrintSheet,
        disabled: true //disabled on start, enabled by the controller
    }],

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
                handler: function(grid, rowIndex, colIndex) {
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
        this.store.setFields(fields);
        this.reconfigure(this.store, columns);
    }
});

