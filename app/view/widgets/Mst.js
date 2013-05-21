// Combobox for Messtelle
Ext.define('Lada.view.widgets.Mst' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.mst',
        store: 'Sql',
        displayField:'name',
        valueField: 'id' ,
        emptyText:'Wählen Sie eine Messstelle',
    initComponent: function() {
        this.callParent(arguments);
    }
});
