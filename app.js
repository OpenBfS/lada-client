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
                    xtype: 'panel',
                    title: 'Probenauswahlmaske',
                    html: 'Probenliste wird hier angezeigt.'
                }
            ]
        });
    },
});
