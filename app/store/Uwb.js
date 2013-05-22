Ext.define('Lada.store.Uwb', {
    extend: 'Ext.data.Store',
    fields: ['umwId'],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/uwb'
        },
        reader: {
            type: 'json'
        }
    }
});
