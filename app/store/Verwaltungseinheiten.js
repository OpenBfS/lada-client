/**
 * Store for Verwaltungseinheiten
 */
Ext.define('Lada.store.Verwaltungseinheiten', {
    extend: 'Ext.data.Store',
    fields: ['gemId', 'bezeichnung'],
    sorters: [{
        property: 'bezeichnung',
    }],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/verwaltungseinheit'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
