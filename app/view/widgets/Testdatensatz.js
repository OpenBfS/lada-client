// Combobox for Umweltbereich
Ext.define('Lada.view.widgets.Testdatensatz' ,{
        extend: 'Ext.form.ComboBox',
        editable: false,
        alias: 'widget.testdatensatz',
        store: 'Testdatensatz',
        queryMode: 'local',
        displayField:'testdatensatz',
        valueField: 'testdatensatzId',
        emptyText:'Testdatensatz?',
    initComponent: function() {
        this.callParent(arguments);
    }
});
