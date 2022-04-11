/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Messwerte
 */
Ext.define('Lada.model.Messwert', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'messungsId'
    }, {
        name: 'messgroesseId'
    }, {
        name: 'messwert'
    }, {
        name: 'messwertNwg',
        convert: function(v) {
            if (!v) {
                return null;
            }
            return '<';
        }
    }, {
        name: 'messfehler',
        type: 'float',
        convert: function(v) {
            if (!v) {
                return null;
            }
            return v;
        },
        serialize: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'nwgZuMesswert'
    }, {
        name: 'mehId'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time',
        convert: Lada.util.Date.convertTimeFnDefaultNow
    }, {
        name: 'treeModified',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'parentModified',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'warnings',
        persist: false
    }, {
        name: 'errors',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/messwert',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});
