Ext.define('Lada.store.Proben', {
    extend: 'Ext.data.Store',
    fields: ['probeId', 'datenbasisId'],
    model: 'Lada.model.Probe',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
            read: 'data/proben.json',
            update: 'data/proben2.json'
        },
        reader: {
            type: 'json',
            root: 'proben'
        }
    }
});

