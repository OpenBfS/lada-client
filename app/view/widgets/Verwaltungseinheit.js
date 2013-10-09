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
        hideTrigger: true,
        // Enable filtering of comboboxes
        autoSelect: false,
        queryMode: 'remote',
        triggerAction : 'type',
        typeAhead: true,
        minChars: 2,
    initComponent: function() {
        this.callParent(arguments);
    }
});
