Ext.define('Lada.model.Ortdetail', {
    extend: 'Ext.data.Model',
    requires: ['Lada.lib.Helpers'],
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
