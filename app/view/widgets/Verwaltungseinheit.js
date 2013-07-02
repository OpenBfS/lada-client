// Combobox for Verwaltungseinheit
Ext.define('Lada.view.widgets.Verwaltungseinheit' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.verwaltungseinheiten',
        store: 'Verwaltungseinheiten',
        displayField: 'bezeichnung',
        valueField: 'gemId',
        emptyText:'Wählen Sie eine Verwaltungseinheit',
    initComponent: function() {
        this.callParent(arguments);
    }
});
