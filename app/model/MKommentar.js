/**
 * Model class for Kommentare on Messungen
 */
Ext.define('Lada.model.MKommentar', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "id"},
        {name: "kid"},
        {name: "messungsId"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "kdatum", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "ktext"}
    ],
    idProperty: "id",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/messkommentare',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getEidi: function() {
        var kid =  this.get('kid');
        var messId = this.get('messungsId');
        var probeId = this.get('probeId');
        return "/" + kid + "/" + messId + "/" + probeId;
    }
});
