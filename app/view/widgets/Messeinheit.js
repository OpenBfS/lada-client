/**
 * Combobox for Messeinheit
 */
Ext.define('Lada.view.widgets.Messeinheit' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.messeinheit',
        store: 'Messeinheit',
        displayField: 'einheit',
        valueField: 'mehId',
        emptyText:'Wählen Sie eine Messeinheit',
        // Enable filtering of comboboxes
        autoSelect: false,
        queryMode: 'local',
        triggerAction : 'all',
        typeAhead: true,
        minChars: 0,
    initComponent: function() {
        this.callParent(arguments);
    }
});
