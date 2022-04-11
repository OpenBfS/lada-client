/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Probenehmer Stammdaten
 */
Ext.define('Lada.model.Probenehmer', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'prnId'
    }, {
        name: 'bearbeiter',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'bemerkung',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'bezeichnung'
    }, {
        name: 'kurzBezeichnung'
    }, {
        name: 'ort',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'plz',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'betrieb',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'strasse',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'telefon',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'tourenplan',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'typ',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time',
        convert: Lada.util.Date.convertTimeFn
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/probenehmer',
        reader: {
            type: 'json',
            totalProperty: 'totalCount',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});
