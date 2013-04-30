Ext.define('Lada.store.Proben', {
    extend: 'Ext.data.Store',
    fields: ['probeId', 'datenbasisId'],
    model: 'Lada.model.Probe',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'data/proben.json',
        reader: {
            type: 'json',
            root: 'proben'
        }
    }
});

