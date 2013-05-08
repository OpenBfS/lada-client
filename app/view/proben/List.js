Ext.define('Lada.view.proben.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.probenlist',
    maxHeight: 350,
    store: 'Proben',
    initComponent: function() {
        this.columns = [
            {header: 'Datenbasis',  dataIndex: 'datenbasisId', width: 70},
            {header: 'MLP',  dataIndex: 'mlpId', width: 50},
            {header: 'UWB',  dataIndex: 'umwId', width: 50},
            {header: 'HPNR',  dataIndex: 'hauptprobenNr'},
            {header: 'NPNR',  dataIndex: '', width: 50},
            {header: 'E.Gemeinde',  dataIndex: '', flex: 1},
            {header: 'Ursprungsgemeinde',  dataIndex: '', flex: 1},
            {header: 'ProbeID', dataIndex: 'probeId'},
            {header: 'OZB', dataIndex: '', width: 50},
            {header: 'MST', dataIndex: 'mstId', width: 50}
        ];
        this.callParent(arguments);
    }
});
