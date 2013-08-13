/**
 * Combobox for Umweltbereich
 */
Ext.define('Lada.view.widgets.Messeinheit' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.messeinheit',
        store: 'Messeinheit',
        displayField: 'einheit',
        valueField: 'mehId',
        emptyText:'Wählen Sie eine Messeinheit',
    initComponent: function() {
        this.callParent(arguments);
    }
});
