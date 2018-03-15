// this is just a dummy entry, not thought to represent the actual data structure

Ext.define('Lada.model.DummyQuery', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'basequery'},
        {name: 'name'},
        {name: 'owner'},
        {name: 'groups'},
        {name: 'columns'}
        //column:
        //      dataIndex
        //      sort
        //      filter
        //      dataType?
        //      etc. from genQuery?
    ]
});

