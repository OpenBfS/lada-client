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
        this.initSearch();

        // Development related: 
        // Disable "initSearch" call and enable one of the following init
        // methods to get a dialog directly without the need to click through
        // the whole application.
        //this.initMessung();

        this.callParent(arguments);
    },
    initMessung: function() {
        var messung = Ext.create('Lada.model.Messung');
        var win = Ext.create('Lada.view.messungen.Create', {model: messung});
    },
    initSearch: function() {
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
                    hidden: false

                },
                // Resultlist for the query.
                {
                    id: 'result',
                    xtype: 'probenlist',
                    hidden: false
                }
            ]
        };
    }
});
