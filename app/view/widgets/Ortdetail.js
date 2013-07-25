// Combobox for Zusatzwert.
Ext.define('Lada.view.widgets.Ortdetail' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.ortdetail',
        store: 'Ortedetails',
        displayField: 'bezeichnung',
        valueField: 'ortId',
        emptyText:'Wählen Sie einen Ort',
    initComponent: function() {
        this.callParent(arguments);
    }
});
