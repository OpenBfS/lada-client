Ext.define('Lada.model.Messung', {
    extend: 'Ext.data.Model',
    requires: ['Lada.lib.Helpers'],
        fields: [
        {name: "id"},
        {name: "messungsId", mapping:"id.messungsId"},
        {name: "probeId", mapping:"id.probeId"},
        {name: "mmtId"},
        {name: "nebenprobenNr"},
        {name: "messdauer"},
        {name: "messzeitpunkt", convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "fertig", type: "boolean"},
        {name: "letzteAenderung", type:"date"},
        {name: "geplant", type: "boolean"}
    ],
    idProperty: "id",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/messung',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getEidi: function() {
        var messId = this.get('messungsId');
        var probeId = this.get('probeId');
        return "/" + messId + "/" + probeId;
    }
});

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
