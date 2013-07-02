Ext.define('Lada.model.Ortdetail', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "ortId"},
        {name: "bezeichnung"},
        {name: "beschreibung"},
        {name: "usnscharf"},
        {name: "nutsCode"},
        {name: "koordXExtern"},
        {name: "koordYExtern"},
        {name: "hoeheLand"},
        {name: "letzteAenderung", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "longitude", type: 'float'},
        {name: "latitude", type: 'float'},
        {name: "staatId"},
        {name: "gemId"},
        {name: "oTyp"}
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

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}

