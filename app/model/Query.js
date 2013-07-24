Ext.define('Lada.model.Query', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "id"},
        {name: "name"},
        {name: "description"},
        {name: "sql"},
        {name: "results"},
        {name: "filters"},
    ],
    proxy: {
        type: 'rest',
        url: 'server/rest/query',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
