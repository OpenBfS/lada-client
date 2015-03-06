/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Proben
 */
Ext.define('Lada.view.grid.FilterResult', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.filterresultgrid',

    store: 'ProbenList',

    multiSelect: true,

    viewConfig: {
        emptyText: 'Keine Proben gefunden.',
        deferEmptyText: false
    },

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                text: 'Hinzufügen',
                icon: 'resources/img/list-add.png',
                action: 'add'
            }, {
                text: 'Import',
                icon: 'resources/img/svn-commit.png',
                action: 'import'
            }, {
                text: 'Export',
                icon: 'resources/img/svn-update.png',
                action: 'export'
            }]
        }];
        this.columns = [];
        this.callParent(arguments);
    },

    /**
     * Setup columns of the Grid dynamically based on a list of given cols.
     * The function is called from the {@link Lada.controller.Sql#selectSql
     * select sql event}
     */
    setupColumns: function(cols) {
        var resultColumns = [];
        var fields = [];

        resultColumns.push({
            header: 'RW',
            dataIndex: 'readonly',
            width: 30,
            renderer: function(value) {
                if (value) {
                    return '<img src="resources/img/lock_16x16.png"/>';
                }
                return '<img src="resources/img/unlock_16x16.png"/>';
            }
        });
        fields.push(new Ext.data.Field({
            name: 'readonly'
        }));
        for (var i = cols.length - 1; i >= 0; i--) {
            if (cols[i] === 'id') {
                continue;
            }
            resultColumns.push(cols[i]);
            fields.push(new Ext.data.Field({
                name: cols[i].dataIndex
            }));
        }
        this.store.model.setFields(fields);
        this.reconfigure(this.store, resultColumns);
    }
});
