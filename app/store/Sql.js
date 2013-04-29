Ext.define('Lada.store.Sql', {
    extend: 'Ext.data.Store',
    fields: ['id', 'name', 'description', 'sql'],
    data  : [
        {'id': '1', 'name': 'MST, UWB', 'description': 'Beschreibung der MST, UWB Abfrage', 'sql': 'select * from xxx'},
        {'id': '2', 'name': 'Rbegin', 'description': 'Beschreibung der Rbegin Abfrage', 'sql': 'select * from xxx'}
    ]
});
