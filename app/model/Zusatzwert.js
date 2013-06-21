Ext.define('Lada.model.Zusatzwert', {
    extend: 'Ext.data.Model',
    requires: [
        'Lada.model.Probenzusatzwert'
    ],
    fields: [
        {name: "id"},
        {name: "pzsId", mapping: "id.pzsId"},
        {name: "probeId", mapping: "id.probeId"},
        {name: "nwgZuMesswert", type: 'float'},
        {name: "messwertPzs", type: 'float'},
        {name: "messfehler", type: 'float'},
        {name: "letzteAenderung", type: 'date', convert: ts2date, defaultValue: new Date()}

        //// This are fields from the s_zusatzwert_table. They are currently not
        //// needed for displaying values in the grid.
        //{name: "sprobenZusatz"},
        //{name: "sprobenZusatz_beschreibung", mapping: "sprobenZusatz.beschreibung"},
        //{name: "sprobenZusatz_pzsId", mapping: "sprobenZusatz.pzsId"},
        //{name: "sprobenZusatz_mehId", mapping: "sprobenZusatz.mehId"}
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
    }
});

function buildId(v, record){
    return record.get('probeId') + ',' + record.get('pzsId');
}

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
