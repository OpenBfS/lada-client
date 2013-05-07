Ext.define('Lada.store.Proben', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Probe',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
            read: 'server/rest/proben',
            //read: 'data/proben.json',
            update: 'data/proben2.json'
        },
        reader: {
            type: 'json',
            contentType: "application/json; charset=utf-8;"
        }
    }
});

