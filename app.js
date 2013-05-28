Ext.application({
    name: 'Lada',
    // Setting this variable to true should trigger loading the Viewport.js
    // file which sets ob the viewport. But this does not happen.
    autoCreateViewport: true,
    launch: function() {
        // Start the application.
        console.log('Launching the application');
    },
    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Proben',
        'Kommentare',
        'Sql'
    ]
});
