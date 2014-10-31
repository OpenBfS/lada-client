/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * A Probe.
 * This class represents and defines the model of a "Probe"
 **/
Ext.define('Lada.model.Probe', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "id"},
        {name: "probeIdAlt"},
        {name: "hauptprobenNr"},
        {name: "test"},
        {name: "netzbetreiberId"},
        {name: "mstId"},
        {name: "datenbasisId"},
        {name: "baId"},
        {name: "probenartId"},
        {name: "mediaDesk"},
        {name: "media"},
        {name: "umwId"},
        {name: "probeentnahmeBeginn", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "probeentnahmeEnde", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "mittelungsdauer"},
        {name: "letzteAenderung", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "erzeugerId"},
        {name: "probeNehmerId"},
        {name: "mpKat"},
        {name: "mplId"},
        {name: "mprId"},
        {name: "solldatumBeginn", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "solldatumEnde", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},

        // Readonly-Flag (sent additionaly by the server, not part of the
        // model)
        {name: "readonly"}
    ],
    idProperty: "id",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/probe',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
