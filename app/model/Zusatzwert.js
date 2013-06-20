Ext.define('Lada.model.Zusatzwert', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "id"},
        {name: "probeId"},
        //{name: "pzsId", mapping: "id.pzsId"},
        {name: "sprobenZusatz"},

        // Hier muss die tatsächliche Nachweisgrenze eingegeben werden.
        {name: "nwgZuMesswert", type: 'float'},
        {name: "messwertPzs", type: 'float'},
        {name: "messfehler", type: 'float'},
        {name: "letzteAenderung", type: 'date', convert: ts2date, defaultValue: new Date()},

        // This are fields from the s_zusatzwert_table. They are currently not
        // needed for displaying values in the grid.
        {name: "sprobenZusatz_beschreibung", mapping: "sprobenZusatz.beschreibung"},
        {name: "sprobenZusatz_pzsId", mapping: "sprobenZusatz.pzsId"},
        {name: "sprobenZusatz_mehId", mapping: "sprobenZusatz.mehId"}
    ],
    //// we can use the hasOne shortcut on the model to create a hasOne association
    //associations: [{ type: 'hasOne', model: 'ProbenZusatzwert', foreignKey: 'pzsId'}],
    idProperty: "id",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/zusatzwert',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

//Ext.define('Lada.model.ProbenZusatzwert', {
//    extend: 'Ext.data.Model',
//    fields: [
//        {name: "pzsId"},
//        {name: "medId"},
//        {name: "bschreibung"},
//        {name: "zusatzwert"},
//        {name: "eudfKeyword"}
//    ],
//    idProperty: "pzsId",
//    proxy: {
//        type: 'rest',
//        appendId: true, //default
//        url: 'server/rest/probenzusatzwert',
//        reader: {
//            type: 'json',
//            root: 'data'
//        }
//    }
//};

function buildId(v, record){
    return record.get('probeId') + ',' + record.get('pzsId');
}

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
