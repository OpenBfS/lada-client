Ext.define('Lada.store.Probenzusatzwert', {
    extend: 'Ext.data.Store',
    fields: ['pzsId', 'beschreibung', 'zusatzwert'],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/probenzusatz'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
