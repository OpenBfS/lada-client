/**
 * Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux.form.DateTimeField': 'resources/lib/datetime/UX_DateTimeField.js',
        'Ext.ux.DateTimeMenu': 'resources/lib/datetime/UX_DateTimeMenu.js',
        'Ext.ux.DateTimePicker': 'resources/lib/datetime/UX_DateTimePicker.js',
        'Ext.ux.form.TimePickerField': 'resources/lib/datetime/UX_TimePickerField.js',
        'Ext.i18n': 'resources/lib/i18n/'
    }
});

Ext.application({

    // Name of the application. Do not change as this name is used in
    // references!
    name: 'Lada',

    // Setting up translations. This is done using a ext-plgin which can be
    // found on https://github.com/elmasse/Ext.i18n.Bundle
    requires: [
        'Lada.override.Table',
        'Lada.override.RowEditor',
        'Ext.i18n.Bundle',
        'Ext.layout.container.Column',
        'Lada.store.Datenbasis',
        'Lada.store.Messeinheiten',
        'Lada.store.Messgroessen',
        'Lada.store.Messmethoden',
        'Lada.store.Messstellen',
        'Lada.store.Netzbetreiber',
        'Lada.store.Locations',
        'Lada.store.Pflichtmessgroessen',
        'Lada.store.Probenarten',
        'Lada.store.Probenzusaetze',
        'Lada.store.Staaten',
        'Lada.store.Umwelt',
        'Lada.store.Verwaltungseinheiten'
    ],
    bundle: {
        bundle: 'Lada',
        lang: 'de-DE',
        path: 'resources/i18n',
        noCache: true
    },

    // Setting this variable to true triggers loading the Viewport.js
    // file which sets ob the viewport.
    autoCreateViewport: true,

    // Start the application.
    launch: function() {
        Ext.create('Lada.store.Datenbasis', {
            storeId: 'datenbasis'
        });
        Ext.create('Lada.store.Messeinheiten', {
            storeId: 'messeinheiten'
        });
        Ext.create('Lada.store.Messgroessen', {
            storeId: 'messgroessen'
        });
        Ext.create('Lada.store.Messmethoden', {
            storeId: 'messmethoden'
        });
        Ext.create('Lada.store.Messstellen', {
            storeId: 'messstellen'
        });
        Ext.create('Lada.store.Netzbetreiber', {
            storeId: 'netzbetreiber'
        });
        Ext.create('Lada.store.Locations', {
            storeId: 'locations'
        });
        Ext.create('Lada.store.Pflichtmessgroessen', {
            storeId: 'pflichtmessgroessen'
        });
        Ext.create('Lada.store.Probenarten', {
            storeId: 'probenarten'
        });
        Ext.create('Lada.store.Probenzusaetze', {
            storeId: 'probenzusaetze'
        });
        Ext.create('Lada.store.Staaten', {
            storeId: 'staaten'
        });
        Ext.create('Lada.store.Umwelt', {
            storeId: 'umwelt'
        });
        Ext.create('Lada.store.Verwaltungseinheiten', {
            storeId: 'verwaltungseinheiten'
        });
    },

    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Lada.controller.Filter',
        'Lada.controller.FilterResult',
        'Lada.controller.ProbeForm',
        'Lada.controller.OrtGrid',
        'Lada.controller.ProbenzusatzwertGrid',
        'Lada.controller.PKommentarGrid'
    ]
});
