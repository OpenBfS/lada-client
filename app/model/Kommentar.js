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
    // TODO: This id field is currently a combined field of probeId and kid
    // which cases problems when generating a request with this id to the
    // server.
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
