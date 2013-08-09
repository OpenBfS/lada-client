Ext.define('Lada.model.Staat', {
    extend: 'Ext.data.Model',
    requires: ['Lada.lib.Helpers'],
    fields: [
        {name: "staatId", type: 'int'},
        {name: "staat"},
        {name: "staatIso"},
        {name: "staatKurz"}
    ],
    idProperty: "staatId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/staat',
        api: {
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
