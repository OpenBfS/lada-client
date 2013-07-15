Ext.define('Lada.model.Ort', {
    extend: 'Ext.data.Model',
    fields: [
        // Field from the l_ort table
        {name: "portId", type: 'int'},
        {name: "ortId", type: 'int'},
        {name: "probeId"},
        {name: "ortsTyp"},
        {name: "ortszusatztext"},
        {name: "letzteAenderung", type: 'date', convert: ts2date, defaultValue: new Date()}
    ],
    idProperty: "portId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/ort',
        api: {
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getEidi: function() {
        var ortId = this.get('portId');
        var probeId = this.get('probeId');
        return "/" + ortId + "/" + probeId;
    }
});

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
