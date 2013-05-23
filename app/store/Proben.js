Ext.define('Lada.store.Proben', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Probe',
    proxy: {
        type: 'ajax',
        url: 'server/rest/proben',
        api: {
        },
        reader: {
            type: 'json'
        }
    }
});
