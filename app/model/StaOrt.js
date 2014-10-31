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
Ext.define('Lada.model.StaOrt', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "id"},
        {name: "bezeichnung"},
        {name: "beschreibung"},
        {name: "unscharf"},
        {name: "nutsCode"},
        {name: "koordXExtern"},
        {name: "koordYExtern"},
        {name: "hoeheLand"},
        {name: "letzteAenderung", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "longitude", type: 'float'},
        {name: "latitude", type: 'float'},
        {name: "staatId"},
        {name: "gemId"},
        {name: "otyp"}
    ],
    idProperty: "id",
    proxy: {
        type: 'rest',
        url: 'server/rest/sta_ort',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

