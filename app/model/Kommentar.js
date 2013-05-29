Ext.define('Lada.model.Kommentar', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "id"},
        {name: "kid"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "kdatum"},
        {name: "ktext"}
    ],
    idProperty: "id",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/kommentare',
        reader: {
            type: 'json'
        }
    }
});
