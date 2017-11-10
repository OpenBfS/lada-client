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
        name: 'aktiv',
        type: 'boolean',
        convert: function(v) {
            if (v === '') {
                return null;
            } else if (v === 'f') {
                return false;
            }
            return true;
        },
        serialize: function(v) {
            if (v === null || v === '') {
                return null;
            } else if (v === false) {
                return 'f';
            }
            return 't';
        }
    }, {
        name: 'ortId',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'nutsCode'
    }, {
        name: 'anlageId'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'gemId',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'staatId',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'kdaId',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
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
        name: 'koordXExtern',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'koordYExtern',
        convert: function(v) {
            if (v === '') {
                return null;
            }
            return v;
        }
    }, {
        name: 'longitude',
        type: 'float'
    }, {
        name: 'latitude',
        type: 'float'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time',
        convert: function(v) {
            if (!v) {
                return null;
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
        timeout: 60000,
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
