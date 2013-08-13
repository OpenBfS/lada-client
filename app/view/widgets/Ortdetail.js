/**
 * Combobox for Ortdetails
 */
Ext.define('Lada.view.widgets.Ortdetail' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.ortdetail',
        store: 'Ortedetails',
        displayField: 'bezeichnung',
        valueField: 'ortId',
        emptyText:'Wählen Sie einen Ort',
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
