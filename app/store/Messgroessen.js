/**
 * Store for Messgroessen
 */
Ext.define('Lada.store.Messgroessen', {
    extend: 'Ext.data.Store',
    fields: ['messgroesseId', 'messgro0esse'],
    sorters: [{
        property: 'messgro0esse',
        transform: function(val) {
            if (val) {
                return val.toLowerCase();
            } else {
                return "";
            };
        }
    }],
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
