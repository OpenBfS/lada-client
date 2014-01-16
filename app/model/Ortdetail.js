/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model class for Ortdetail
 */
Ext.define('Lada.model.Ortdetail', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "ortId"},
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
    idProperty: "ortId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/ortinfo',
        api: {
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
