Ext.define('Lada.model.Zusatzwert', {
    extend: 'Ext.data.Model',
    requires: [
        'Lada.model.Probenzusatzwert'
    ],
    fields: [
        {name: "id"},
        // Commented out as pzsId must not be submitted to the server. On
        // serverside the pzsId is taken from the nested sprobenZusatz object.
        //{name: "pzsId", mapping: "id.pzsId"},
        {name: "probeId", mapping: "id.probeId"},
        {name: "nwgZuMesswert", type: 'float'},
        {name: "messwertPzs", type: 'float'},
        {name: "messfehler", type: 'float'},
        {name: "letzteAenderung", type: 'date', convert: ts2date, defaultValue: new Date()},

        // Field for the nested Probenzusatzobject. This one is needed to have
        // access to the nested data in the grid.
        // TODO: I would have expected that this field does not need to be
        // defined explicitly as there is the hasOne asscociation defined
        // which name and associationKey named "sprobenZusatz". Anyway it does
        // not seem to make problems.
        {name: "sprobenZusatz"}
    ],
    hasOne: [
        {
            model: 'Lada.model.Probenzusatzwert',
            primaryKey: 'pzsId',
            name: 'sprobenZusatz',
            associationKey: 'sprobenZusatz',
            foreignKey: 'pzsId',
            getterName: 'getProbenzusatz',
            setterName: 'setProbenzusatz'
        }
    ],
    idProperty: "id",
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
        var sprobenZusatz = this.get('sprobenZusatz');
        var pzsId =  sprobenZusatz.pzsId;
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
