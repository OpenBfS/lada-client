Ext.define('Lada.store.Datenbasis', {
    extend: 'Ext.data.Store',
    fields: ['datenbasisId', 'beschreibung', 'datenbasis'],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/datenbasis'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

