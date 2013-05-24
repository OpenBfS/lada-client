// Combobox for Umweltbereich
Ext.define('Lada.view.widgets.Betriebsart' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.betriebsart',
        store: 'Betriebsart',
        queryMode: 'local',
        displayField:'betriebsart',
        valueField: 'betriebsartId',
        emptyText:'Wählen Sie eine Betriebsart',
    initComponent: function() {
        this.callParent(arguments);
    }
});
