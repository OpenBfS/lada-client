Ext.define('Lada.model.Staat', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "staatId", type: 'int'},
        {name: "staat"},
        {name: "staatIso"},
        {name: "staatKurz"}
    ],
    idProperty: "staatId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/staat',
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
