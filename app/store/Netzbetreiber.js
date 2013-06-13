Ext.define('Lada.store.Netzbetreiber', {
    extend: 'Ext.data.Store',
    fields: ['netzbetreiberId', 'netzbetreiber'],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/netzbetreiber'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

