/**
 * Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.application({

    // Name of the application. Do not change as this name is used in
    // references!
    name: 'Lada',

    requires: [
        'Lada.view.Viewport',
        'Lada.override.Table',
        'Lada.override.RestProxy',
        'Lada.override.Toolbar',
        'Lada.override.Window',
        'Lada.override.RowEditor',
        'Lada.override.i18n.DE',
        'Lada.override.RowExpander',
        'Lada.override.FilteredComboBox',
        'Lada.override.Date',
        'Lada.override.DatePicker',
        'Lada.override.UnderlayPool',
        'Lada.view.plugin.GridRowExpander',
        'Ext.i18n.Bundle',
        'Ext.layout.container.Column',
        'Lada.query.QueryProxy',
        'Lada.store.LocalPagingStore',
        'Lada.store.KtaGruppe',
        'Lada.store.Datenbasis',
        'Lada.store.Messeinheiten',
        'Lada.store.Messgroessen',
        'Lada.store.Messstellen',
        'Lada.store.Leitstelle',
        'Lada.store.Probenarten',
        'Lada.store.Probenzusaetze',
        'Lada.store.Staaten',
        'Lada.store.Verwaltungseinheiten',
        'Lada.store.VerwaltungseinheitenUnfiltered',
        'Lada.store.Bundesland',
        'Lada.store.Landkreis',
        'Lada.store.Regierungsbezirk',
        'Lada.store.StatusWerte',
        'Lada.store.StatusStufe',
        'Lada.store.StatusKombi',
        'Lada.store.Probenehmer',
        'Lada.store.DatensatzErzeuger',
        'Lada.store.DownloadQueue',
        'Lada.store.UploadQueue',
        'Lada.store.MessprogrammKategorie',
        'Lada.store.GridColumn',
        'Lada.store.Query',
        'Lada.model.Messstelle',
        'Lada.model.GenericResults',
        'Lada.model.GridColumn',
        'Lada.model.Query',
        'Lada.model.DownloadQueue',
        'Lada.model.UploadQueue',
        'Lada.view.widget.TimeZoneButton',
        'Lada.view.window.ElanScenarioWindow',
        'Lada.view.window.TrackedWindow',
        'Lada.util.Date',
        'Lada.util.WindowTracker',
        'Lada.util.LocalStorage',
        'Lada.util.WindowTracker',
        'Koala.util.DokpoolRequest'
    ],
    statics: {
        applicationUpdateTitle: 'Anwendungsupdate',
        applicationUpdateText: 'Für diese Anwendung steht ein Update zur Verfügung. Jetzt neu laden?',
        dblClickTimeout: 500
    },

    // Setting up translations. This is done using a ext-plugin which can be
    // found on https://github.com/elmasse/Ext.i18n.Bundle
    bundle: {
        bundle: 'Lada',
        language: (function() {
        //Set Language according to build profile
            switch (Ext.manifest.profile) {
                case 'lada-en':
                    return 'en-US';
                case 'lada-de':
                    return 'de-DE';
                default: return 'de-DE';
            }
        }()),
        path: 'resources/i18n',
        noCache: true
    },

    beforeCloseHandler: function(evt) {
        var i18n = Lada.getApplication().bundle;
        // match different handling from different browsers
        var confirmMessage = i18n.getMsg('window.confirmclose');
        evt.returnValue = confirmMessage;
        return confirmMessage;
    },

    // Setting this variable to true triggers loading the Viewport.js
    // file which sets ob the viewport.
    //autoCreateViewport: true,

    // Start the application.
    launch: function() {
        var loadmask = Ext.get('loadmask');
        if (loadmask) {
            loadmask.destroy();
        }
        Ext.JSON.encodeDate = function(o) {
            return '"' + Ext.Date.format(o, 'c') + '"';
        };

        Lada.username = '';
        Lada.userroles = '';
        Lada.logintime = '';
        Lada.mst = [];
        Lada.netzbetreiber = [];
        Lada.clientVersion = '4.6.0-SNAPSHOT';
        Lada.serverVersion = '';
        // paging sizes available for the client
        Lada.availablePagingSizes = [
        {value: 50, label: '50'},
        {value: 100, label: '100'},
        {value: 500, label: '500'},
        {value: 2000, label: '2000'},
        {value: 5000, label: '5000 (lange Ladezeit!)'}
        ];

        //initial default paging size, may be changed by user
        Lada.pagingSize = 50;

        Ext.Ajax.request({
            url: 'lada-server/rest/user',
            method: 'GET',
            scope: this,
            success: this.onLoginSuccess,
            failure: this.onLoginFailure
        });

        Ext.Ajax.request({
            url: 'resources/appContext.json',
            method: 'GET',
            scope: this,
            success: function(response) {
                var json = Ext.decode(response.responseText);
                if (json.data) {
                    Lada.appContext = json.data;
                }
            }
        });

        Ext.tip.QuickTipManager.init();

        // ask before closing/refreshing the window.
        // Not all browsers will respect this, depending on settings
        window.addEventListener('beforeunload', this.beforeCloseHandler);
    },

    /*
     * Gets called if the appCache signals an app update. It shows a confirm
     * dialog which reloads the page on confirmation. xxx
     */
    onAppUpdate: function() {
        //FIXME i18n does not work on Firefox on early load of appUpdate uses statics
        Ext.Msg.confirm(Lada.$application.applicationUpdateTitle,
            Lada.$application.applicationUpdateText,
            function(choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    onLoginFailure: function(response) {
        var i18n = Lada.getApplication().bundle;
        try {
            var json = Ext.decode(response.responseText);
            if (json) {
                if (json.message === '699') {
                    /* This is the unauthorized message with the authentication
                     * redirect in the data */
                    Ext.MessageBox.alert(i18n.getMsg('err.init.noname'),
                        json.data);
                    return;
                }
                if (json.message === '698') {
                    /* This is general authentication error */
                    Ext.MessageBox.alert(i18n.getMsg('err.init.nologin'),
                        json.data);
                    return;
                }
            }
        } catch (e) {
            /* This is likely a 404 or some unknown error.
             * Show general error then. */
        }
        Ext.MessageBox.alert(i18n.getMsg('err.init.generic.title'),
            i18n.getMsg('err.init.generic.msg'));
    },

    onLoginSuccess: function(response) {
        /* Parse Username and Timestamp */
        var json = Ext.decode(response.responseText);
        Lada.username = json.data.username;
        Lada.userId = json.data.userId;
        Lada.userroles = json.data.roles;
        Lada.logintime = json.data.servertime;
        Lada.mst = []; // Messstellen this user may select
        Lada.funktionen = json.data.funktionen;
        Lada.netzbetreiber = json.data.netzbetreiber;
        Lada.netzbetreiberFunktionen = json.data.netzbetreiberFunktionen;
        //Lada.serverVersion
        this.getServerVersion();
        var mstLabor = json.data.messstelleLabor;
        for (var i = 0; i < mstLabor.length; i++) {
            Lada.mst.push(mstLabor[i].messstelle);
            Lada.mst.push(mstLabor[i].labor);
        }

        Ext.create('Lada.store.Datenbasis', {
            storeId: 'datenbasis'
        });
        Ext.create('Lada.store.Messeinheiten', {
            storeId: 'messeinheiten'
        });
        Ext.create('Lada.store.Messgroessen', {
            storeId: 'messgroessen'
        });
        Ext.create('Lada.store.GridColumn', {
            storeId: 'columnstore'
        });

        // Used in: widget.Leitstelle (used in query panel)
        // Extends store.Messstellen and uses proxy.type: 'memory'.
        // Data added in load-callback on store 'messstellen' (an instance
        // of store.Messstellen) created further down.
        Ext.create('Lada.store.Leitstelle', {
            storeId: 'leitstellenwidget'
        });

        // Used in: widget.Messstelle, form.Messprogramm, form.Datensatzerzeuger,
        // form.Probe, window.Messprogramm, window.MessungEdit,
        // window.Ortszuordnung, window.GenProbenFromMessprogramm,
        // window.ProbeEdit, window.MessungCreate, panel.Map, panel.QueryPanel,
        // grid.PKommentar, ...
        // Load-callback here fills data into store 'leitstellenwidget'.
        // Server service: MessstelleService via model.Messstelle
        Ext.create('Lada.store.Messstellen', {
            storeId: 'messstellen',
            listeners: {
                load: {
                    fn: function() {
                        var lst = Ext.data.StoreManager.get(
                                     'leitstellenwidget');
                        lst.removeAll(true);
                        var reclst = [];
                        var rec = [];
                        this.each(function(rr) {
                            rec.push(rr.copy());
                            if (rr.get('id').match(/200.0/)) {
                                reclst.push(rr.copy());
                            }
                        });
                        lst.add(reclst);
                    }
                }
            }
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
        Ext.create('Lada.store.VerwaltungseinheitenUnfiltered', {
            storeId: 'verwaltungseinheitenwidget'
        });
        Ext.create('Lada.store.Bundesland', {
            storeId: 'bundeslandwidget'
        });
        Ext.create('Lada.store.Landkreis', {
            storeId: 'landkreiswidget'
        });
        Ext.create('Lada.store.Regierungsbezirk', {
            storeId: 'regierungsbezirkwidget'
        });
        Ext.create('Lada.store.Verwaltungseinheiten', {
            storeId: 'verwaltungseinheiten',
            listeners: {
                load: function() {
                    var w = Ext.data.StoreManager.get(
                        'verwaltungseinheitenwidget');
                    var b = Ext.data.StoreManager.get(
                        'bundeslandwidget');
                    var l = Ext.data.StoreManager.get(
                        'landkreiswidget');
                    var r = Ext.data.StoreManager.get(
                        'regierungsbezirkwidget');
                    w.removeAll(true);
                    b.removeAll(true);
                    l.removeAll(true);
                    r.removeAll(true);
                    var rec = [];
                    var recb = [];
                    var recl = [];
                    var recr = [];
                    this.each(function(rr) {
                        rec.push(rr.copy());
                        if (rr.get('isBundesland')) {
                            recb.push(rr.copy());
                        }
                        if (rr.get('isLandkreis')) {
                            recl.push(rr.copy());
                        }
                        if (rr.get('isRegbezirk')) {
                            recr.push(rr.copy());
                        }
                    });
                    w.add(rec);
                    l.add(recl);
                    b.add(recb);
                    r.add(recr);
                }
            }
        });
        // TODO: usage of this store unclear: reloaded in probenehmer
        // controller, but never used (probenehemr widget uses different
        // instance)
        Ext.create('Lada.store.Probenehmer', {
            storeId: 'probenehmer',
            proxy: {
                type: 'rest',
                url: 'lada-server/rest/probenehmer',
                reader: {
                    type: 'json',
                    totalProperty: 'totalCount',
                    rootProperty: 'data'
                },
                limitParam: undefined,
                startParam: undefined,
                pageParam: undefined
            },
            autoLoad: true
        });
        // TODO: usage of this store unclear: reloaded in Datensatzerzeuger
        // controller, but never used. Details here should go into model or
        // store definition
        Ext.create('Lada.store.DatensatzErzeuger', {
            storeId: 'datensatzerzeuger',
            proxy: {
                type: 'rest',
                url: 'lada-server/rest/datensatzerzeuger',
                reader: {
                    type: 'json',
                    totalProperty: 'totalCount',
                    rootProperty: 'data'
                },
                limitParam: undefined,
                startParam: undefined,
                pageParam: undefined
            },
            autoLoad: true
        });
        // TODO: Similar to Datensatzerzeuger
        Ext.create('Lada.store.MessprogrammKategorie', {
            storeId: 'messprogrammkategorie',
            proxy: {
                type: 'rest',
                url: 'lada-server/rest/messprogrammkategorie',
                reader: {
                    type: 'json',
                    totalProperty: 'totalCount',
                    rootProperty: 'data'
                },
                limitParam: undefined,
                startParam: undefined,
                pageParam: undefined
            },
            autoLoad: true
        });
        Ext.create('Lada.store.StatusWerte', {
            storeId: 'statuswerte',
            autoLoad: true
        });
        Ext.create('Lada.store.StatusStufe', {
            storeId: 'statusstufe',
            autoLoad: true
        });
        Ext.create('Lada.store.StatusKombi', {
            storeId: 'statuskombi',
            autoLoad: true
        });
        Ext.create('Lada.store.KtaGruppe', {
            storeId: 'ktaGruppe',
            autoLoad: true
        });

        // Store containing all MST a User is allowed to set.
        // Used in: Ext.form.field.ComboBox instances in window.SetStatus,
        // panel.FileUpload, grid.PKommentar, grid.MKommentar.
        // widget.Messstelle (a widget.base.ComboBox) uses store 'messstellen'
        // and filters locally in exactly the same way.
        // Server service: MessstelleService via model.Messstelle
        Ext.create('Lada.store.Messstellen', {
            storeId: 'messstellenFiltered',
            filters: function(item) {
                if (Ext.Array.contains(Lada.mst, item.get('id'))) {
                    return true;
                }
                return false;
            }
        });

        Ext.create('Ext.data.Store', {
            storeId: 'pagingSizes',
            model: Ext.create('Ext.data.Model', {
                fields: [
                    {name: 'label', type: 'string'},
                    {name: 'value', type: 'string'}
                ]
            }),
            data: Lada.availablePagingSizes
        });
        Ext.create('Lada.store.DownloadQueue', {
            storeId: 'downloadqueue-print'
        });
        Ext.create('Lada.store.DownloadQueue', {
            storeId: 'downloadqueue-export'
        });
        Ext.create('Lada.store.UploadQueue', {
            storeId: 'uploadqueue'
        });
        Ext.create('Lada.view.Viewport');
        this.initElanScenarios();
    },

    initElanScenarios: function() {
        Lada.util.LocalStorage.setCurrentUser(Lada.username);
        var dokpool = Koala.util.DokpoolRequest;
        //Configure dokpool utility
        dokpool.elanScenarioUrl = '../dokpool/bund/contentconfig/scen/';
        dokpool.storageModule = Lada.util.LocalStorage;
        dokpool.updateActiveElanScenarios();
        //Create the display window
        Ext.create('Lada.view.window.ElanScenarioWindow');
        window.setInterval(function() {
            dokpool.updateActiveElanScenarios();
        }, 60000);
    },

    getServerVersion: function() {
        var i18n = Lada.getApplication().bundle;
        Ext.Ajax.request({
            url: 'lada-server/rest/version',
            method: 'GET',
            headers: {},
            success: function(response) {
                var json = Ext.decode(response.responseText);
                Lada.serverVersion = json.data;
            },
            failure: function() {
                console.log('Error in retrieving the server version.'
                    + ' It might be lower than 2.0-beta2'
                    + ' Or something is broken...');
                Lada.serverVersion = i18n.getMsg('err.msg.generic.title');
            }
        });
    },

    // Sets the paging size and fires 'pagingSizeChangedEvent' if
    // new value differs from old
    setPagingSize: function(newVal) {
        if (newVal !== Lada.pagingSize) {
            Lada.pagingSize = newVal;
            Lada.getApplication().fireEvent('pagingSizeChanged');
        }
    },

    /**
     * Fix for odd behavior of some browsers in the toExponential(digits)
     * function (MS Edge falsely rounds down some least significant digits).
     * @param {Number} value the numerical value to parse
     * @param {Number} digits the amount of digits as in toExponential()
     * @returns {String}
     */
    toExponentialString: function(value, digits) {
        var rawExp = value.toExponential();
        if (digits === undefined) {
            return rawExp;
        }
        var fixedExp = value.toExponential(digits);
        if (fixedExp.length === rawExp.length && fixedExp !== rawExp) {
            return rawExp;
        } else {
            return fixedExp;
        }
    },

    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Lada.controller.grid.Probenzusatzwert',
        'Lada.controller.grid.PKommentar',
        'Lada.controller.grid.MKommentar',
        'Lada.controller.grid.Messung',
        'Lada.controller.grid.Ortszuordnung',
        'Lada.controller.grid.Messmethode',
        'Lada.controller.GridExport',
        'Lada.controller.grid.DynamicGrid',
        'Lada.controller.Query',
        'Lada.controller.Global',
        'Lada.controller.Print',
        'Lada.controller.ElanScenario',
        'Lada.controller.grid.Downloads',
        'Lada.controller.SetTags'
    ]
});
