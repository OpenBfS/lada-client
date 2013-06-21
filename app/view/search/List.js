var searchStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'name', 'description', 'sql'],
    data  : [
        {'id': '1', 'name': 'MST, UWB', 'description': 'Beschreibung der MST, UWB Abfrage', 'sql': 'select * from xxx'},
        {'id': '2', 'name': 'Rbegin', 'description': 'Beschreibung der Rbegin Abfrage', 'sql': 'select * from xxx'}
    ]
});

Ext.define('Lada.view.search.List' ,{
    extend: 'Ext.form.FieldSet',
    title: 'SQL-Auswahl',
    alias: 'widget.queryselector',

    initComponent: function() {
        this.items = [
            {
                id: 'search',
                xtype: 'combobox',
                editable: false,
                store: searchStore,
                displayField:'name',
                valueField:'id',
                emptyText:'Wählen Sie eine Abfrage'
            }
        ];
        this.callParent(arguments);
    }
});
