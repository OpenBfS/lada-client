// Combobox for Umweltbereich
Ext.define('Lada.view.widgets.Messegroesse' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.messgroesse',
        store: 'Messgroessen',
        displayField: 'messgro0esse',
        valueField: 'messgroesseId',
        emptyText:'Wählen Sie eine Messgröße',
    initComponent: function() {
        this.callParent(arguments);
    }
});
