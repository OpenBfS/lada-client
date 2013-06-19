Ext.define('Lada.store.Messeinheit', {
    extend: 'Ext.data.Store',
    fields: ['mehId', 'einheit'],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/messeinheit'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
