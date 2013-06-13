Ext.define('Lada.store.Mst', {
    extend: 'Ext.data.Store',
    fields: ['mstId'],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/mst'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
