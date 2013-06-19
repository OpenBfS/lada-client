Ext.define('Lada.model.Kommentar', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "id"},
        {name: "kid", mapping:"id.kid"},
        {name: "convertedId", convert:buildId},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "kdatum", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "ktext"}
    ],
    idProperty: "convertedId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/kommentare',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

function buildId(v, record){
    return record.get('probeId') + record.get('kid');
}

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
