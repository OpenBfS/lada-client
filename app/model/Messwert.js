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
        name: 'messungsId',
        type: 'int'
    }, {
        name: 'messgroesseId',
        type: 'int'
    }, {
        name: 'messwert',
        type: 'float',
        allowNull: true
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
        allowNull: true
    }, {
        name: 'nwgZuMesswert',
        type: 'float',
        allowNull: true
    }, {
        name: 'mehId',
        type: 'int'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'treeModified',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'parentModified',
        type: 'date',
        dateFormat: 'time'
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
