Ext.define('Lada.view.sql.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.sqllist',
    store: 'Sql',

    initComponent: function() {
        this.columns = [
            {header: 'ID',  dataIndex: 'id',  flex: 1},
            {header: 'Kurzname', dataIndex: 'name', flex: 1},
            {header: 'SQL', dataIndex: 'desc', flex: 1}
        ];

        this.callParent(arguments);
    }
});
