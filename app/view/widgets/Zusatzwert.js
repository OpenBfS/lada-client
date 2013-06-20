// Combobox for Umweltbereich
Ext.define('Lada.view.widgets.Zusatzwert' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.zusatzwert',
        store: 'Probenzusatzwert',
        displayField: 'beschreibung',
        valueField: 'pzsId',
        emptyText:'Wählen Sie einen Zusatzwert',
    initComponent: function() {
        this.callParent(arguments);
    }
});
