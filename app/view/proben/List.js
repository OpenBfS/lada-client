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
                    }
                ]
            }
        ];
        this.columns = [
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
        ];
        this.callParent(arguments);
    }
});
