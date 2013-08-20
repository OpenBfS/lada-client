/**
 * A ProbeList.
 * This class represents the result list of "Proben" in the search query
 * */
Ext.define('Lada.model.ProbeList', {
    extend: 'Lada.model.Base',
    fields: [
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
