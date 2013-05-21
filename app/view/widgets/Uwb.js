// Combobox for Umweltbereich
Ext.define('Lada.view.widgets.Uwb' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.uwb',
        store: 'Sql',
        displayField:'name',
        valueField: 'id',
        emptyText:'Wählen Sie eine Abfrage',
    initComponent: function() {
        this.callParent(arguments);
    }
});
