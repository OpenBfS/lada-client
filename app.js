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
        'Ext.i18n': 'resources/lib/ext/i18n/',
        'Ext.ux.upload': 'resources/lib/ext/upload'
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
        'Lada.store.Orte',
        'Lada.store.Pflichtmessgroessen',
        'Lada.store.Probenarten',
        'Lada.store.Probenzusaetze',
        'Lada.store.Staaten',
        'Lada.store.Umwelt',
        'Lada.store.Verwaltungseinheiten',
        'Lada.store.StatusWerte',
        'Lada.store.StatusStufe'
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
        Lada.username = '';
        Lada.userroles = '';
        Lada.logintime = '';
        Lada.mst = [];
        Lada.clientVersion = '2.2-STAMMDATEN';
        Lada.serverVersion = '';

        var queryString = document.location.href.split('?')[1];
        if (queryString) {
            Lada.openIDParams = queryString;
        }
        Ext.Ajax.request({
            url: 'lada-server/rest/user',
            method: 'GET',
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
                    Ext.MessageBox.alert('Es konnte kein Benutzername gefunden werden!',
                            json.data);
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

    onLoginSuccess: function(response) {
        Ext.create('Lada.view.Viewport');

        /* Parse Username and Timestamp */
        var json = Ext.decode(response.responseText);
        Lada.username = json.data.username;
        Lada.userroles = json.data.roles;
        Lada.logintime = json.data.servertime;
        Lada.mst = json.data.mst; //Store Messstellen this user may select
        //Lada.serverVersion
        this.getServerVersion();

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
        Ext.create('Lada.store.Orte', {
            storeId: 'orte'
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
        Ext.create('Lada.store.StatusWerte', {
            storeId: 'statuswerte',
            autoLoad: true
        });
        Ext.create('Lada.store.StatusStufe', {
            storeId: 'statusstufe',
            autoLoad: 'true'
        });
        //A Store containing all MST a User is allowed to set.
        Ext.create('Lada.store.Messstellen', {
            storeId: 'messstellenFiltered',
            filters: function(item) {
                if (Ext.Array.contains(Lada.mst, item.get('id'))) {
                    return true;
                }
                return false;
            }
        });
    },

    getServerVersion: function() {
        var i18n = Lada.getApplication().bundle;
        Ext.Ajax.request({
            url: 'lada-server/rest/version',
            method: 'GET',
            headers: {
                'X-OPENID-PARAMS': Lada.openIDParams
            },
            success: function(response) {
                var json = Ext.decode(response.responseText);
                Lada.serverVersion = json.data;
            },
            failure: function(response) {
                console.log('Error in retrieving the server version.'
                    + ' It might be lower than 2.0-beta2'
                    + ' Or something is broken...');
                Lada.serverVersion = i18n.getMsg('err.msg.generic.title');
            }
        });
    },

    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Lada.controller.Filter',
        'Lada.controller.ModeSwitcher',
        'Lada.controller.Map',
        'Lada.controller.form.Probe',
        'Lada.controller.form.Messung',
        'Lada.controller.form.Ort',
        'Lada.controller.form.Location',
        'Lada.controller.form.Messprogramm',
        'Lada.controller.grid.Ortszuordnung',
        'Lada.controller.grid.Probenzusatzwert',
        'Lada.controller.grid.PKommentar',
        'Lada.controller.grid.Messmethode',
        'Lada.controller.grid.MKommentar',
        'Lada.controller.grid.Messung',
        'Lada.controller.grid.Messwert',
        'Lada.controller.grid.Status',
        //FilterResult
        'Lada.controller.grid.MessprogrammeList',
        'Lada.controller.grid.ProbeList',
        //Stammdaten
        'Lada.controller.grid.Datensatzerzeuger',
        'Lada.controller.grid.Probenehmer',
        'Lada.controller.grid.MessprogrammKategorie'
        ]
});
