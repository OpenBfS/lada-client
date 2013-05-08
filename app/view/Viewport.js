Ext.define('Lada.view.Viewport' ,{
    extend: 'Ext.container.Viewport',
    requires: [
        'Lada.view.sql.List',
        'Lada.view.sql.Variables',
        'Lada.view.proben.List'
    ],
    initComponent: function() {
        console.log('Setting up Viewport');
        this.items = {
            xtype: 'panel',
            title: '<center>Probenauswahlmaske</center>',
            bodyPadding: '10 10',
            items: [
                {
                    xtype: 'sqllist',
                    margin: '0 0 10 0'
                },
                // Variables settings for the current selected sql statement.
                //{
                //    id: 'variables',
                //    xtype: 'variables'
                //},
                // Resultlist for the query.
                {
                    id: 'result',
                    xtype: 'probenlist'
                }
            ]
        };
        this.callParent(arguments);
    }
});
