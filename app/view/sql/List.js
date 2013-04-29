Ext.define('Lada.view.sql.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.sqllist',

    title: 'SQL-Auswahl',

    initComponent: function() {
        this.store = {
            fields: ['id', 'name', 'description', 'sql'],
            data  : [
                {'id': '1', 'name': 'MST, UWB', 'description': 'Beschreibung der MST, UWB Abfrage', 'sql': 'select * from xxx'},
                {'id': '2', 'name': 'Rbegin', 'description': 'Beschreibung der Rbegin Abfrage', 'sql': 'select * from xxx'}
            ]
        };

        this.columns = [
            {header: 'ID',  dataIndex: 'id',  flex: 1},
            {header: 'Kurzname', dataIndex: 'name', flex: 1},
            {header: 'SQL', dataIndex: 'desc', flex: 1}
        ];

        this.callParent(arguments);
    }
});

