/*
 * The following fields are avalailable to show in the search result. Please
 * Define which columns should be visible in whioch order in the fields
 * variable for each query.
 *
'datenbasisId'
'mplId'
'umwId'
'messmethode'
'hauptprobenNr'
'nebenprobenNr'
'bezeichnung'
'kreis'
'probeId'
'mstId'
*/

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
