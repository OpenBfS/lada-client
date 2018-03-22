// this is just a dummy entry, not thought to represent the actual data structure

Ext.define('Lada.model.DummyQuery', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id'},
        {name: 'basequery'},
        {name: 'name'},
        {name: 'owner'},
        {name: 'groups'},
        {name: 'sorting'},
        {name: 'columns'}
        //column:
        //      dataIndex
        //      sort
        //      filter
        //      dataType?
        //      etc. from genQuery?
    ]
});

