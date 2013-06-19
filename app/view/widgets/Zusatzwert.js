// Combobox for Umweltbereich
Ext.define('Lada.view.widgets.Zusatzwert' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.zusatzwert',
        store: 'Probenzusatzwert',
        displayField: 'zusatzwert',
        valueField: 'pzsId',
        emptyText:'Wählen Sie einen Zusatzwert',
    initComponent: function() {
        this.callParent(arguments);
    }
});
