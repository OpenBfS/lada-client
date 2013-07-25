Ext.define('Lada.store.Ortedetails', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Ortdetail',
    sorters: [{
        property: 'bezeichnung',
    }],
    autoLoad: true
});
