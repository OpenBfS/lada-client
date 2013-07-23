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
            /* List of fields which should be displayed in the proben list.
             * The field names must match the fieldnames in returned JSON object. */
            'fields': ['datenbasisId', 'mplId', 'umwId', 'messmethode', 'hauptprobenNr', 'nebenprobenNr', 'bezeichnung', 'kreis', 'probeId', 'mstId'],
            /* List of filters. The filters must match the fields in the
             * "WHERE" part of the defined SQL query. */
            'filters': ['mstId', 'umwId'],
        },
        {
            'id': '2',
            'name': 'Rbegin',
            'description': 'Beschreibung der Rbegin Abfrage',
            'sql': 'select * from xxx',
            'fields': ['mplId', 'datenbasisId', 'umwId', 'messmethode', 'hauptprobenNr', 'nebenprobenNr', 'bezeichnung', 'kreis', 'probeId', 'mstId'],
            'filters': [],
        }
    ],
});
