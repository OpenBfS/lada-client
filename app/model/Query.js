Ext.define('Lada.model.Query', {
    extend: 'Ext.data.Model',
    fields: [
        {name: "id"},
        {name: "name"},
        {name: "description"},
        {name: "sql"},
        {name: "fields"},
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});
