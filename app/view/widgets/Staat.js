/**
 * Combobox for Staat
 */
Ext.define('Lada.view.widgets.Staat' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.staat',
        store: 'Staaten',
        displayField: 'staat',
        valueField: 'staatId',
        emptyText:'Wählen Sie einen Staat',
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
