Ext.define('Lada.store.Probenart', {
    extend: 'Ext.data.Store',
    fields: ['probenartId', 'beschreibung', 'probenart', 'probenartEudfId'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/probenart'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

