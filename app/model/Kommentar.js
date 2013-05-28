Ext.define('Lada.model.Kommentar', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "id"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "kdatum"},
        {name: "ktext"}
    ],
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/kommentare',
        api: {
        },
        reader: {
            type: 'json'
        }
    }
});
