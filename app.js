Ext.application({
    name: 'Lada',
    // Setting this variable to true should trigger loading the Viewport.js
    // file which sets ob the viewport. But this does not happen.
    autoCreateViewprt: false,
    launch: function() {
        // Start the application.
        console.log('Launching the application');
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            title: 'Probenauswahlmaske',
            items: [
                {
                    xtype: 'probenlist'
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
