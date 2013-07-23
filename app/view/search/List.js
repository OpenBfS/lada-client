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
                store: 'Queries',
                displayField:'name',
                valueField:'id',
                emptyText:'Wählen Sie eine Abfrage'
            }
        ];
        this.callParent(arguments);
    }
});
