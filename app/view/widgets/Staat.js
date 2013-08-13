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
    initComponent: function() {
        this.callParent(arguments);
    }
});
