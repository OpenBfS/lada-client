/**
 * Model class for Staat
 */
Ext.define('Lada.model.Staat', {
    extend: 'Lada.model.Base',
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
