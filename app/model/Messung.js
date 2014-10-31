/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model class for Messungen
 */
Ext.define('Lada.model.Messung', {
    extend: 'Lada.model.Base',

    fields: [{
        name: "id"
    }, {
        name: "messungsId"
    }, {
        name: "probeId"
    }, {
        name: "mmtId"
    }, {
        name: "nebenprobenNr"
    }, {
        name: "messdauer"
    }, {
        name: "messzeitpunkt",
        convert: Lada.lib.Helpers.ts2date,
        defaultValue: new Date()
    }, {
        name: "fertig",
        type: "boolean"
    }, {
        name: "letzteAenderung",
        type:"date"
    }, {
        name: "geplant",
        type: "boolean"
    }],

    idProperty: "id",

    proxy: {
        type: 'rest',
        url: 'server/rest/messung',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
