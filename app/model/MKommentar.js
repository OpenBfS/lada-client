Ext.define('Lada.model.MKommentar', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "id"},
        {name: "messungsId"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "kdatum", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "ktext"}
    ],
    idProperty: "id",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/messkommentare',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getEidi: function() {
        var kid =  this.get('id').kid;
        var messId = this.get('messungsId');
        var probeId = this.get('probeId');
        return "/" + kid + "/" + messId + "/" + probeId;
    }
});

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
