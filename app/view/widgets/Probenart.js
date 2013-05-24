// Combobox for Umweltbereich
Ext.define('Lada.view.widgets.Probenart' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.probenart',
        store: 'Probenart',
        queryMode: 'local',
        displayField:'probenart',
        valueField: 'probenartId',
        emptyText:'Wählen Sie eine Probenart',
    initComponent: function() {
        this.callParent(arguments);
    }
});
