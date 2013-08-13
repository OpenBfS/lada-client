var testdatensatzStore = Ext.create('Ext.data.Store', {
    fields: ['testdatensatzId', 'testdatensatz'],
    data: [
        {"testdatensatzId":true, "testdatensatz":"Ja"},
        {"testdatensatzId":false, "testdatensatz":"Nein"}
    ]
});

/**
 * Combobox for Testdatensatz.
 * This widget is also used a generic "Ja/Nein" combobox.
 */
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
