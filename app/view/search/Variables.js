Ext.define('Lada.view.search.Variables' ,{
        extend: 'Ext.panel.Panel',
        alias: 'widget.variables1',
        border: false,
    initComponent: function() {
        this.items = [
            {
                id: 'sqlVar1',
                xtype: 'queryselector',
                fieldLabel: 'Variables for SQL 1',
                labelWidth: 300
            }
        ];
        this.callParent(arguments);
    }
});

//Ext.define('Lada.view.search.Variables' ,{
//    extend: 'Ext.panel.Panel',
//    alias: 'widget.variables',
//    border: false,
//
//    initComponent: function() {
//        this.items = [
//            {
//                id: 'sqlVar1',
//                xtype: 'displayfield',
//                fieldLabel: 'Variables for SQL 1',
//                labelWidth: 300
//            },
//            {
//                id: 'sqlVar2',
//                xtype: 'displayfield',
//                fieldLabel: 'Variables for SQL 2',
//                labelWidth: 300
//            }
//        ];
//        this.callParent(arguments);
//    }
//});
