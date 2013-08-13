/**
 * Model class for Kommentare
 */
Ext.define('Lada.model.Kommentar', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "kId"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "kdatum", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
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
