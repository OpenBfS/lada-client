Ext.define('Lada.store.Probenzusatzwerte', {
    extend: 'Ext.data.Store',
    sorters: [{
        property: 'beschreibung',
    }],
    model: 'Lada.model.Probenzusatzwert'
});
