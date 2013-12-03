/**
 * Model class for Messwerte
 */
Ext.define('Lada.model.Messwert', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "id"},
        {name: "messungsId", mapping:"id.messungsId"},
        {name: "probeId", mapping:"id.probeId"},
        {name: "messgroesseId", mapping:"id.messgroesseId"},
        {name: "messwert", type:"float"},
        {name: "messwertNwg"},
        {name: "messfehler", type:"float"},
        {name: "nwgZuMesswert", type:"float"},
        {name: "mehId"},
        {name: "grenzwertueberschreitung", type: "boolean"},
        {name: "letzteAenderung", type:"date"}
    ],
    idProperty: "id",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/messwert',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getEidi: function() {
        var mid =  this.get('messgroesseId');
        var messId = this.get('messungsId');
        var probeId = this.get('probeId');
        return "/" + mid + "/" + messId + "/" + probeId;
    }
});
