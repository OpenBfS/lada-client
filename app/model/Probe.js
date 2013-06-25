Ext.define('Lada.model.Probe', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "probeId"},
        {name: "baId"},
        {name: "datenbasisId"},
        {name: "erzeugerId"},
        {name: "hauptprobenNr"},
        {name: "messmethode"},
        {name: "nebenprobenNr"},
        {name: "bezeichnung"},
        {name: "kreis"},
        {name: "letzteAenderung", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "media"},
        {name: "mediaDesk"},
        {name: "mittelungsdauer"},
        {name: "mpKat"},
        {name: "mplId"},
        {name: "mprId"},
        {name: "mstId"},
        {name: "netzbetreiberId"},
        {name: "probeNehmerId"},
        {name: "probeentnahmeBeginn", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "probeentnahmeEnde", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "probenartId"},
        {name: "solldatumBeginn", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "solldatumEnde", type: 'date', convert: ts2date, defaultValue: new Date()},
        {name: "test"},
        {name: "umwId"}
    ],
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

function buildId(v, record){
    var newId = record.get('probeId') + record.get('nebenprobenNr');
    return newId;
}

function ts2date(v, record){
    // Converts a timestamp into a date object.
    return new Date(v);
}
