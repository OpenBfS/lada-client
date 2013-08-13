/**
 * A Probe.
 * This class represents and defines the model of a "Probe"
 * */
Ext.define('Lada.model.Probe', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "probeId"},
        {name: "baId"},
        {name: "datenbasisId"},
        {name: "erzeugerId"},
        {name: "hauptprobenNr"},
        {name: "messmethode"},
        {name: "nebenprobenNr"},
        {name: "letzteAenderung", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "media"},
        {name: "mediaDesk"},
        {name: "mittelungsdauer"},
        {name: "mpKat"},
        {name: "mplId"},
        {name: "mprId"},
        {name: "mstId"},
        {name: "netzbetreiberId"},
        {name: "probeNehmerId"},
        {name: "probeentnahmeBeginn", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "probeentnahmeEnde", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "probenartId"},
        {name: "solldatumBeginn", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "solldatumEnde", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "test"},
        {name: "umwId"},

        // Readonly-Flag (sent additionaly by the server, not part of the
        // model)
        {name: "readonly"}
    ],
    idProperty: "probeId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/proben',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
