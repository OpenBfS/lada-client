// Combobox for Zusatzwert.
Ext.define('Lada.view.widgets.Zusatzwert' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.probenzusatzwert',
        store: 'Probenzusatzwerte',
        displayField: 'beschreibung',
        valueField: 'pzsId',
        emptyText:'Wählen Sie einen Zusatzwert',
    initComponent: function() {
        this.callParent(arguments);
    }
});
