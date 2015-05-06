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

    store: null, //'ProbenList',

    multiSelect: true,

    viewConfig: {
        emptyText: 'Keine Ergebnisse gefunden.',
        deferEmptyText: false
    },

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                id: 'tbtitle',
                text: '',
            },
            '->',
            {
                text: 'Probe erstellen',
                icon: 'resources/img/list-add.png',
                action: 'addProbe'
            }, {
                text: 'Messprogramm erstellen',
                icon: 'resources/img/list-add.png',
                action: 'addMessprogramm'
            },
            '-',
            {
                text: 'Proben Importieren',
                icon: 'resources/img/svn-commit.png',
                action: 'import'
            }, {
                text: 'Proben Exportieren',
                icon: 'resources/img/svn-update.png',
                action: 'export'
            }
            ]
        }];
        this.columns = [];
        this.callParent(arguments);
    },

    /**
     * This sets the Store of the FilterResultGrid
     */
    setStore: function(store){
        var i18n = Lada.getApplication().bundle;

        this.removeDocked(Ext.getCmp('ptbar'), true);
        this.reconfigure(store);
        this.addDocked([{
            xtype: 'pagingtoolbar',
            id: 'ptbar',
            dock: 'bottom',
            store: store,
            displayInfo: true
        }]);

        //Reset the Text int the Toolbar.
        var t = Ext.getCmp('tbtitle');
        if (store.model.modelName == 'Lada.model.MessprogrammList') {
            t.setText(i18n.getMsg('probeplanning'));
        }
        else if (store.model.modelName == 'Lada.model.ProbeList') {
            t.setText(i18n.getMsg('probelist'));
        }
        else {
            t.setText('');
            console.log('The model '+store.model.modelName+
                'was not defined in the FilterResultGrid.' +
                ' Hence the title could not be set.');
        }
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
            sortable: false,
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
