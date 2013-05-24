// Combobox for Datenbasis
Ext.define('Lada.view.widgets.Datenbasis' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.datenbasis',
        store: 'Datenbasis',
        displayField:'datenbasis',
        valueField: 'datenbasisId',
        emptyText:'Wählen Sie eine Datenbasis',
    initComponent: function() {
        this.callParent(arguments);
    }
});

