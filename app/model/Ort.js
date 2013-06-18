Ext.define('Lada.model.Ort', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "ort"},
        {name: "ortId", mapping:"ort.ortId", type: 'int'},
        {name: "otyp", mapping:"ort.otyp"},
        {name: "bezeichnung", mapping:"ort.bezeichnung"},
        {name: "beschreibung", mapping:"ort.beschreibung"},
        {name: "gemId", mapping:"ort.gemId"},
        {name: "staatId", mapping:"ort.staatId"},
        {name: "unscharf", mapping:"ort.unscharf"},
        {name: "nutsCode", mapping:"ort.nutsCode"},
        {name: "koordXExtern", mapping:"ort.koordXExtern"},
        {name: "koordYExtern", mapping:"ort.koordYExtern"},
        {name: "hoeheLand", mapping:"ort.hoeheLand", type: 'float'},
        {name: "letzteAenderung", mapping:"ort.letzteAenderung", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "latitude", mapping:"ort.latitude", type: 'float'},
        {name: "longitude", mapping:"ort.longitude", type: 'float'}
    ],
    idProperty: "ortId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/ort',
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
