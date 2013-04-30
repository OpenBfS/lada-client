Ext.define('Lada.view.proben.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.probenlist',
    title: 'Alle Proben',
    store: 'Proben',

    initComponent: function() {
        this.columns = [
            {header: 'Datenbasis',  dataIndex: 'datenbasisId',  flex: 1},
            {header: 'ProbeID', dataIndex: 'probeId', flex: 1}
        ];
        this.callParent(arguments);
    }
});
