// Combobox for Umweltbereich
Ext.define('Lada.view.widgets.Uwb' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.uwb',
        store: 'Uwb',
        displayField:'umwId',
        valueField: 'umwId',
        emptyText:'Wählen Sie einen Umweltbereich',
    initComponent: function() {
        this.callParent(arguments);
    }
});
