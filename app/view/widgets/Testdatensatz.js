// Combobox for Testdatensatz
var testdatensatzStore = Ext.create('Ext.data.Store', {
    fields: ['testdatensatzId', 'testdatensatz'],
    data: [
        {"testdatensatzId":true, "testdatensatz":"Ja"},
        {"testdatensatzId":false, "testdatensatz":"Nein"}
    ]
});

Ext.define('Lada.view.widgets.Testdatensatz' ,{
        extend: 'Ext.form.ComboBox',
        editable: false,
        alias: 'widget.testdatensatz',
        store: testdatensatzStore,
        queryMode: 'local',
        displayField:'testdatensatz',
        valueField: 'testdatensatzId',
        emptyText:'Testdatensatz?',
    initComponent: function() {
        this.callParent(arguments);
    }
});
