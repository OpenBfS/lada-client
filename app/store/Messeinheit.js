Ext.define('Lada.store.Messeinheit', {
    extend: 'Ext.data.Store',
    fields: ['mehId', 'einheit'],
    sorters: [{
        property: 'einheit',
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
        read: 'server/rest/messeinheit'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
