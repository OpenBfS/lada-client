Ext.define('Lada.store.Staaten', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Staat',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/staat'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
