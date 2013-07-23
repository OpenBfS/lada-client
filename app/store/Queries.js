Ext.define('Lada.store.Queries', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Query',
    data  : [
        {
            'id': '1',
            'name': 'MST, UWB',
            'description': 'Beschreibung der MST, UWB Abfrage',
            'sql': 'select * from xxx',
            'fields': []
        },
        {
            'id': '2',
            'name': 'Rbegin',
            'description': 'Beschreibung der Rbegin Abfrage',
            'sql': 'select * from xxx',
            'fields': []
        }
    ],
});
