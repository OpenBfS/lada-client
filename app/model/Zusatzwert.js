/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Zusatzwerte
 */
Ext.define('Lada.model.Zusatzwert', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'probeId'
    }, {
        name: 'pzsId'
    }, {
        name: 'kleinerAls',
        convert: function(v) {
            if (!v) {
                return null;
            }
            return '<';
        }
    }, {
        name: 'messwertPzs'
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
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time',
        convert: Lada.util.Date.convertTimeFn,
        defaultValue: new Date()
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
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/zusatzwert',
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
