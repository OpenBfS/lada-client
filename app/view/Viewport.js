Ext.define('Lada.view.Viewport' ,{
    extend: 'Ext.container.Viewport',
    requires: [
        'Lada.view.Sql',
        'Lada.view.Proben'
    ],
    layout: 'fit',
    initComponent: function() {
        console.log('Setting up Viewport');
        this.items = {
            xtype: 'probenlist'
            //items: [{
            //    xtype: 'probenlist'
            //}]
        };
        this.callParent(arguments);
    }
});
