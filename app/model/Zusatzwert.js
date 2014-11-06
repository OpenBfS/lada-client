/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Zusatzwerte
 */
Ext.define('Lada.model.Zusatzwert', {
    extend: 'Lada.model.Base',

    fields: [{
        name: 'id'
    }, {
        name: 'probeId'
    }, {
        name: 'pzsId'
    }, {
        name: 'nwgZuMesswert',
        type: 'float'
    }, {
        name: 'messwertPzs',
        type: 'float'
    }, {
        name: 'messfehler',
        type: 'float'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        convert: Lada.lib.Helpers.ts2date,
        defaultValue: new Date()
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'server/rest/zusatzwert',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            // TODO: Check if this function is really needed (torsten)
            // <2013-09-18 15:58>
            writeEverything: true
        }
    },

    getMesseinheit: function(pzsId) {
        var zstore = Ext.data.StoreManager.get('staProbenzusaetze');
        var mstore = Ext.data.StoreManager.get('staMesseinheiten');
        var mehId = zstore.getById(pzsId).get('mehId');
        console.log('mehid: ' + mehId);
        var record = mstore.getById(mehId);
        return record.get('einheit');
    }
});
