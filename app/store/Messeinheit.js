Ext.define('Lada.store.Messeinheit', {
    extend: 'Ext.data.Store',
    fields: ['mehId', 'einheit'],
    autoLoad: true,
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
