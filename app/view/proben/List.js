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
            {header: 'HPNR',  dataIndex: 'hauptprobenNr'},
            {header: 'E.Gemeinde',  dataIndex: '', flex: 1},
            {header: 'Ursprungsgemeinde',  dataIndex: '', flex: 1},
            {header: 'ProbeID', dataIndex: 'probeId'},
            {header: 'OZB', dataIndex: '', width: 50},
            {header: 'MST', dataIndex: 'mstId', width: 50}
        ];
        this.callParent(arguments);
    }
});
