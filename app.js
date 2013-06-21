Ext.application({

    // Name of the application. Do not change as this name is used in
    // references!
    name: 'Lada',

    // Setting up translations. This is done using a ext-plgin which can be
    // found on https://github.com/elmasse/Ext.i18n.Bundle
    requires: ['Ext.i18n.Bundle'],
    bundle: {
        bundle: 'Lada',
        lang: 'de-DE',
        path: 'resources',
        noCache: true
    },

    // Setting this variable to true triggers loading the Viewport.js
    // file which sets ob the viewport.
    autoCreateViewport: true,

    // Start the application.
    launch: function() {
        console.log('Launching the application');
    },

    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Sql'
        //'Proben',
        //'Kommentare',
        //'Sql',
        //'Zusatzwerte',
        //'Orte',
        //'Messungen'
    ]
});
