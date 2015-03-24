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
        'Lada.override.RestProxy',
        'Lada.override.RowEditor',
        'Lada.override.i18n.DE',
        'Lada.override.JSON',
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
    //autoCreateViewport: true,

    // Start the application.
    launch: function() {
        var queryString = document.location.href.split('?')[1];
        if (queryString) {
            Lada.openIDParams = queryString;
        }
        Ext.Ajax.request({
            url: 'lada-server/login?return_to=' + window.location.href,
            method: 'GET',
            headers: {
                'X-OPENID-PARAMS': Lada.openIDParams
            },
            scope: this,
            success: this.onLoginSuccess,
            failure: this.onLoginFailure
        });
    },

    onLoginFailure: function(response) {
        try {
            var json = Ext.decode(response.responseText);
            if (json) {
                if (json.message === '699') {
                    /* This is the unauthorized message with the authentication
                     * redirect in the data */
                    var authUrl = json.data;
                    location.href = authUrl;
                    return;
                }
                if (json.message === '698') {
                    /* This is general authentication error */
                    Ext.MessageBox.alert('Kommunikation mit dem Login Server fehlgeschlagen',
                            json.data);
                    return;
                }
            }
        }
        catch (e) {
            // This is likely a 404 or some unknown error. Show general error then.
        }
        Ext.MessageBox.alert('Kommunikation mit dem Lada Server fehlgeschlagen',
                'Es konnte keine erfolgreiche Verbindung zum lada server aufgebaut werden.');
    },

    onLoginSuccess: function() {
        /* Strip out the openid query params to look nicers. */
        window.history.pushState(this.name, this.name, window.location.pathname);

        Ext.create('Lada.view.Viewport');

        /* Todo maybe parse username and such from login service response */
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
        'Lada.controller.form.Probe',
        'Lada.controller.form.Messung',
        'Lada.controller.form.Ort',
        'Lada.controller.grid.Ort',
        'Lada.controller.grid.Probenzusatzwert',
        'Lada.controller.grid.PKommentar',
        'Lada.controller.grid.MKommentar',
        'Lada.controller.grid.Messung',
        'Lada.controller.grid.Messwert',
        'Lada.controller.grid.Status',
        'Lada.controller.Map',
        'Lada.controller.form.Location'
    ]
});
