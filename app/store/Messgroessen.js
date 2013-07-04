Ext.define('Lada.store.Messgroessen', {
    extend: 'Ext.data.Store',
    fields: ['messgroesseId', 'messgro0esse'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/messgroesse'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
