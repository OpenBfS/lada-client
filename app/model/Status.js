Ext.define('Lada.model.Status', {
    extend: 'Ext.data.Model',
    requires: ['Lada.lib.Helpers'],
    fields: [
        {name: "sid"},
        {name: "messungsId"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "status", defaultValue: 1},
        {name: "sdatum", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "skommentar"}
    ],
    idProperty: "sid",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/status',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getEidi: function() {
        var sid =  this.get('sid');
        var messId = this.get('messungsId');
        var probeId = this.get('probeId');
        return "/" + sid + "/" + messId + "/" + probeId;
    }
});
