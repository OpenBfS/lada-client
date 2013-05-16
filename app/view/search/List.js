Ext.define('Lada.view.search.List' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.queryselector',
        store: 'Sql',
        displayField:'name',
        valueField: 'id' ,
        emptyText:'Wählen Sie eine Abfrage',
        //typeAhead: true,
        //mode: 'local',
        //triggerAction: 'all',
        //selectOnFocus:true,

    initComponent: function() {
        this.callParent(arguments);
    }
});
//Ext.define('Lada.view.search.List' ,{
//    extend: 'Ext.grid.Panel',
//    alias: 'widget.queryselector',
//    store: 'Sql',
//
//    initComponent: function() {
//        this.columns = [
//            {header: 'ID',  dataIndex: 'id',  flex: 1},
//            {header: 'Kurzname', dataIndex: 'name', flex: 1},
//            {header: 'SQL', dataIndex: 'desc', flex: 1}
//        ];
//
//        this.callParent(arguments);
//    }
//});
