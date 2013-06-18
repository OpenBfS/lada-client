Ext.define('Lada.model.Zusatzwert', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "id"},
        {name: "convertedId", convert:buildId},
        {name: "probeId"},
        {name: "messwertNwg"},
        {name: "messwertPzs"},
        {name: "messfehler"},
        {name: "mehId"},
        {name: "letzteAenderung"},
        {name: "sprobenZusatz"},
        {name: "pzsId"},
        {name: "beschreibung"},
        {name: "zusatzwert"},
        {name: "eudfKeyword"}
    ],
    idProperty: "convertedId",
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

function buildId(v, record){
    return record.get('probeId') + record.get('pzsId');
}
