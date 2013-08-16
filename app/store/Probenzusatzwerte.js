/**
 * Store for Probenzusatzwerte
 */
Ext.define('Lada.store.Probenzusatzwerte', {
    extend: 'Ext.data.Store',
    sorters: [{
        property: 'beschreibung',
    }],
    autoLoad: true,
    model: 'Lada.model.Probenzusatzwert'
});
