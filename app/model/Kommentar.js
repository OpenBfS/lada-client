Ext.define('Lada.model.Kommentar', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "kId"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "kdatum", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "ktext"}
    ],
    idProperty: "kId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/kommentare',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getEidi: function() {
        var kid =  this.get('kId');
        var probeId = this.get('probeId');
        return "/" + kid + "/" + probeId;
    }
});

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
