Ext.define('Lada.store.Proben', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Probe',
    proxy: {
        type: 'ajax',
        api: {
            read: 'server/rest/proben'
        },
        reader: {
            type: 'json'
        }
    }
});
