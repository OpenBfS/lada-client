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
        'Ext.ux.form.DateTimeField': 'resources/datetime/UX_DateTimeField.js',
        'Ext.ux.DateTimeMenu': 'resources/datetime/UX_DateTimeMenu.js',
        'Ext.ux.DateTimePicker': 'resources/datetime/UX_DateTimePicker.js',
        'Ext.ux.form.TimePickerField': 'resources/datetime/UX_TimePickerField.js',
        'Ext.i18n': 'resources/i18n/'
    }
});

Ext.application({

    // Name of the application. Do not change as this name is used in
    // references!
    name: 'Lada',

    // Setting up translations. This is done using a ext-plgin which can be
    // found on https://github.com/elmasse/Ext.i18n.Bundle
    requires: [
        'Ext.i18n.Bundle',
        'Lada.lib.Helpers',
        'Ext.layout.container.Column',
        'Lada.store.StaDatenbasen',
        'Lada.store.StaMesseinheiten',
        'Lada.store.StaMessgroessen',
        'Lada.store.StaMessmethoden',
        'Lada.store.StaMessstellen',
        'Lada.store.StaNetzbetreiber',
        'Lada.store.StaOrte',
        'Lada.store.StaPflichtmessgroessen',
        'Lada.store.StaProbenarten',
        'Lada.store.StaProbenzusaetze',
        'Lada.store.StaStaaten',
        'Lada.store.StaUmwelt',
        'Lada.store.StaVerwaltungseinheiten'
    ],
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
        Ext.create('Lada.store.StaDatenbasen', {
            storeId: 'staDatenbasen'
        });
        Ext.create('Lada.store.StaMesseinheiten', {
            storeId: 'staMesseinheiten'
        });
        Ext.create('Lada.store.StaMessgroessen', {
            storeId: 'staMessgroessen'
        });
        Ext.create('Lada.store.StaMessmethoden', {
            storeId: 'staMessmethoden'
        });
        Ext.create('Lada.store.StaMessstellen', {
            storeId: 'staMessstellen'
        });
        Ext.create('Lada.store.StaNetzbetreiber', {
            storeId: 'staNetzbetreiber'
        });
        Ext.create('Lada.store.StaOrte', {
            storeId: 'staOrte'
        });
        Ext.create('Lada.store.StaPflichtmessgroessen', {
            storeId: 'staPflichtmessgroessen'
        });
        Ext.create('Lada.store.StaProbenarten', {
            storeId: 'staProbenarten'
        });
        Ext.create('Lada.store.StaProbenzusaetze', {
            storeId: 'staProbenzusaetze'
        });
        Ext.create('Lada.store.StaStaaten', {
            storeId: 'staStaaten'
        });
        Ext.create('Lada.store.StaUmwelt', {
            storeId: 'staUmwelt'
        });
        Ext.create('Lada.store.StaVerwaltungseinheiten', {
            storeId: 'staVerwaltungseinheiten'
        });
    },

    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Sql',
        'Proben',
        'Zusatzwerte',
        'Kommentare',
        'MKommentare',
        'Orte',
        'Messungen',
        'Messwert',
        'Status'
    ]
});

Ext.data.writer.Json.override({
    getRecordData: function(record) {
        if (this.writeEverything || record.writeEverything) {
            return record.getAllData();
        }
        return this.callOverridden(arguments);
    }
});

Ext.data.Model.addMembers({
    getAllData: function() {
        var data1 = this.getData();
        var data2 = this.getAssociatedData();
        var dataMerged = Ext.Object.merge(data1, data2);
        return dataMerged;
    },
    getEidi: function() {
        return '/' + this.getId();
    }
});
