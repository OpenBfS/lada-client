Ext.define('Lada.model.Messung', {
    extend: 'Ext.data.Model',
        fields: [
        {name: "id"},
        {name: "messungsId", mapping: "id.messungsId"},
        {name: "convertedId", convert: buildId},
        {name: "lprobeId"},
        {name: "mmtId"},
        {name: "nebenprobenNr"},
        {name: "messdauer"},
        {name: "messzeitpunkt"},
        {name: "fertig", type: "boolean"},
        {name: "letzteAenderung", type:"date"},
        {name: "geplant", type: "boolean"}
    ],
    idProperty: "convertedId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/messung',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

function buildId(v, record){
    return record.get('probeId') + record.get('messungsId');
}
