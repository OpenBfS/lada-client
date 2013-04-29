Ext.application({
    name: 'Lada',
    autoCreateViewprt: true,
    launch: function() {
        // Start the application.
        console.log('Launching the application');
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    xtype: 'probenlist',
                    title: 'Probenauswahlmaske'
                }
            ]
        });
    },
    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Proben'
    ]
});
