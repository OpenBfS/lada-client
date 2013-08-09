Ext.define('Lada.model.Probenzusatzwert', {
    extend: 'Ext.data.Model',
    requires: ['Lada.lib.Helpers'],
    fields: [
        {name: "pzsId"},
        {name: "mehId"},
        {name: "beschreibung"},
        {name: "zusatzwert"},
        {name: "eudfKeyword"}
    ],
    idProperty: "pzsId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/probenzusatz',
        autoload: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
