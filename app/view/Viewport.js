Ext.define('Lada.view.Viewport' ,{
    extend: 'Ext.container.Viewport',
    requires: [
        'Lada.view.search.List',
        'Lada.view.search.Query1',
        'Lada.view.search.Query2',
        'Lada.view.proben.List'
    ],
    initComponent: function() {
        console.log('Setting up Viewport');
        this.items = {
            xtype: 'panel',
            title: '<center>Probenauswahlmaske</center>',
            bodyPadding: '10 10',
            items: [
                // Auswahl einer Abfrage.
                {
                    xtype: 'queryselector',
                    margin: '0 0 10 0'
                },
                // Variables settings for the current selected sql statement.
                {
                    id: 'query1',
                    xtype: 'query1',
                    hidden: true
                },
                {
                    id: 'query2',
                    xtype: 'query2',
                    hidden: true

                },
                // Buttons to trigger the search.
                {
                    id: 'SearchBtnPanel',
                    xtype: 'panel',
                    border: false,
                    margin: '0 0 10 0',
                    items: [
                        {
                            id: 'SearchBtn',
                            text: 'Suchen',
                            xtype: 'button',
                            margin: '0 10 0 0'
                        },
                        {
                            id: 'ResetBtn',
                            text: 'Zurücksetzen',
                            xtype: 'button'
                        }
                    ],
                    hidden: true

                },
                // Resultlist for the query.
                {
                    id: 'result',
                    xtype: 'probenlist',
                    hidden: true
                }
            ]
        };
        this.callParent(arguments);
    }
});
