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
Ext.define('Lada.model.Location', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'bezeichnung'
    }, {
        name: 'beschreibung'
    }, {
        name: 'unscharf'
    }, {
        name: 'nutsCode'
    }, {
        name: 'koordXExtern'
    }, {
        name: 'koordYExtern'
    }, {
        name: 'hoeheLand'
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
        name: 'longitude',
        type: 'float'
    }, {
        name: 'latitude',
        type: 'float'
    }, {
        name: 'staatId'
    }, {
        name: 'verwaltungseinheitId'
    }, {
        name: 'otyp'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/location',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
