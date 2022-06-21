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
    extend: 'Lada.model.LadaBase',

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
        name: 'probeId',
        type: 'int'
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
        name: 'messwertPzs',
        type: 'float',
        allowNull: true
    }, {
        name: 'messfehler',
        type: 'float',
        allowNull: true
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
