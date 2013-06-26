Ext.define('Lada.model.Zusatzwert', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "pzsId"},
        {name: "probeId"},
        {name: "nwgZuMesswert", type: 'float'},
        {name: "messwertPzs", type: 'float'},
        {name: "messfehler", type: 'float'},
        {name: "letzteAenderung", type: 'date', convert: ts2date, defaultValue: new Date()}
    ],
    idProperty: "pzsId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/zusatzwert',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeEverything : true
        }
    },
    getEidi: function () {
        var pzsId =  this.get('pzsId');
        var probeId = this.get('probeId');
        return "/" + pzsId + "/" + probeId;
    }
});

function buildId(v, record){
    return record.get('probeId') + ',' + record.get('pzsId');
}

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
