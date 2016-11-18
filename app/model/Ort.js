/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Ort Stammdaten
 */
Ext.define('Lada.model.Ort', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'aktiv'
    }, {
        name: 'ortId'
    }, {
        name: 'nutsCode'
    }, {
        name: 'anlageId'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'gemId'
    }, {
        name: 'staatId'
    }, {
        name: 'kdaId'
    }, {
        name: 'ozId',
        serialize: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'ortTyp'
    }, {
        name: 'mpArt'
    }, {
        name: 'zone'
    }, {
        name: 'sektor'
    }, {
        name: 'zustaendigkeit'
    }, {
        name: 'berichtstext'
    }, {
        name: 'kurztext'
    }, {
        name: 'langtext'
    }, {
        name: 'unscharf'
    }, {
        name: 'hoeheLand'
    }, {
        name: 'koordXExtern'
    }, {
        name: 'koordYExtern'
    }, {
        name: 'longitude',
        type: 'float'
    }, {
        name: 'latitude',
        type: 'float'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        }
    }, {
        name: 'readonly',
        type: 'boolean'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/ort',
        reader: {
            type: 'json',
            totalProperty: 'totalCount',
            root: 'data'
        }
    }
});
