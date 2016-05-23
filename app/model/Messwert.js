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
    extend: 'Ext.data.Model',

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
            return "<";
        },
//         defaultValue: null
    }, {
        name: 'messfehler',
        type: 'float'
    }, {
        name: 'nwgZuMesswert'
    }, {
        name: 'mehId'
    }, {
        name: 'grenzwertueberschreitung',
        type: 'boolean'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return new Date();
            }
            return new Date(v);
        }
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
        url: 'lada-server/rest/messwert',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
