/*
 * Grid to list Proben
 */
Ext.define('Lada.view.proben.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.probenlist',
    store: 'Proben',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Proben gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 35,
        deferEmptyText: false
    },
    availableColumns: [
            {header: 'Datenbasis',  dataIndex: 'datenbasisId', width: 70},
            {header: 'MPL',  dataIndex: 'mplId', width: 50},
            {header: 'UWB',  dataIndex: 'umwId', width: 50},
            {header: 'MMT',  dataIndex: 'messmethode'},
            {header: 'HPNR',  dataIndex: 'hauptprobenNr'},
            {header: 'NPNR',  dataIndex: 'nebenprobenNr'},
            {header: 'E.Gemeinde',  dataIndex: 'bezeichnung', flex: 1},
            {header: 'Ursprungsgemeinde',  dataIndex: 'kreis', flex: 1},
            {header: 'ProbeID', dataIndex: 'probeId'},
            {header: 'MST', dataIndex: 'mstId', width: 50}
    ],
    initComponent: function() {
        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        text: 'Hinzufügen',
                        icon: 'gfx/plus.gif',
                        action: 'add'
                    },
                    {
                        text: 'Import',
                        icon: 'gfx/plus.gif',
                        action: 'import'
                    }
                ]
            }
        ];
        this.columns = [];
        this.callParent(arguments);
    },
    /**
     * Setup columns of the Grid dynamically based on a list of given cols.
     * The function is called from the {@link Lada.controller.Sql#selectSql
     * select sql event}
     * @parameter {Array} List of cols to show in the Grid.
     */
    setupColumns: function(cols) {
        var rcols = []
        rcols.push({header: 'RW', dataIndex: 'readonly', width: 30, renderer: render_readonly});
        for (var i = cols.length - 1; i >= 0; i--){
            rcols.push(cols[i]);
        };
        this.reconfigure(this.store, rcols);
    }
});

/**
 * Helper function to render a readonly symbol per row in the grid
 * @param {Boolean} flag if the symbol is a readonly symbol.
 */
function render_readonly (value) {
    if (value) {
        return '<img src="gfx/lock_16x16.png"/>';
    } else {
        return '<img src="gfx/unlock_16x16.png"/>';
    }
}
