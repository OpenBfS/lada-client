Ext.define('Lada.store.Proben', {
    extend: 'Ext.data.Store',
    fields: ['probeId', 'datenbasisId'],
    model: 'Lada.model.Probe',
    data  : []
});

