// A dummy for the new (SQL-) Query
//TODO: better name distinction sql-query/ui query
// todo merge with old "query"

Ext.define('Lada.model.DummyBaseQuery', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'name'
    }, {
        name: 'fields'
    }]
});
