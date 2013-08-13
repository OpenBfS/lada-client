/**
 * Combobox for Verwaltungseinheit
 */
Ext.define('Lada.view.widgets.Verwaltungseinheit' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.verwaltungseinheiten',
        store: 'Verwaltungseinheiten',
        displayField: 'bezeichnung',
        valueField: 'gemId',
        emptyText:'Wählen Sie eine Verwaltungseinheit',
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
