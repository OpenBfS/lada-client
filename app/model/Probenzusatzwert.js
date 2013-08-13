/**
 * Model class for Probenzusatzwert
 */
Ext.define('Lada.model.Probenzusatzwert', {
    extend: 'Lada.model.Base',
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
