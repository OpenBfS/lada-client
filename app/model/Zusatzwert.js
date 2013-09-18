/**
 * Model class for Zusatzwerte
 */
Ext.define('Lada.model.Zusatzwert', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "pzsId"},
        {name: "probeId"},
        {name: "nwgZuMesswert", type: 'float'},
        {name: "messwertPzs", type: 'float'},
        {name: "messfehler", type: 'float'},
        {name: "letzteAenderung", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()}
    ],
    idProperty: "pzsId",
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
            // TODO: Check if this function is really needed (torsten)
            // <2013-09-18 15:58> 
            writeEverything : true
        }
    },
    getEidi: function () {
        var pzsId =  this.get('pzsId');
        var probeId = this.get('probeId');
        return "/" + pzsId + "/" + probeId;
    },
    getMesseinheit: function(pzsId) {
        var zstore = Ext.getStore('Probenzusatzwerte');
        var mstore = Ext.getStore('Messeinheit');
        var mehId = zstore.getById(pzsId).get('mehId');
        var record = mstore.findRecord('mehId', mehId);
        return record.get('einheit');
    }
});
