Ext.application({
    name: 'Lada',
    // Setting this variable to true should trigger loading the Viewport.js
    // file which sets ob the viewport. But this does not happen.
    autoCreateViewprt: false,
    launch: function() {
        // Start the application.
        console.log('Launching the application');

        // This code works here, but this should usually be done in the
        // Viewport.js class.
        Ext.create('Ext.panel.Panel', {
            renderTo: Ext.getBody(),
            title: '<center>Probenauswahlmaske</center>',
            items:[
                {
                    xtype: 'panel',
                    id: 'searchSelection',
                    border: false,
                    padding: '10 10 10 10',
                    items: [
                        // 1. SQL-Selection
                        // 1.1 Just a small texttual field
                        {
                            xtype: 'displayfield',
                            padding : '10 0',
                            fieldLabel: '<b>SQL-Auswahl</b>'
                        },
                        // 1.2 Selection of prepared sql statements
                        {
                            xtype: 'sqllist'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    id: 'searchVariables',
                    hidden: true,
                    border: false,
                    padding: '10 10 10 10',
                    items: [
                        // 2. Variable-Definition. Depending on the SQL-Selection we
                        // need to show a small form to be able to diefine some values
                        // within the preselected Search-statement.
                        // 2.1 Just a small texttual field
                        {
                            xtype: 'displayfield',
                            padding : '10 0',
                            fieldLabel: '<b>Variablenbelegung (Zeiten in UTC)</b>',
                            labelWidth: 500
                        }

                    ]
                },
                {
                    xtype: 'probenlist',
                    id: 'searchResult',
                    hidden: true,
                    padding: '10 10 10 10'
                }
            ]
        });
    },
    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Proben',
        'Sql'
    ]
});
