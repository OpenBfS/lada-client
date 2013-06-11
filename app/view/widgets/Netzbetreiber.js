// Combobox for Datenbasis
Ext.define('Lada.view.widgets.Netzbetreiber' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.netzbetreiber',
        store: 'Netzbetreiber',
        displayField:'netzbetreiber',
        valueField: 'netzbetreiberId',
        emptyText:'Wählen Sie einen Netzbetreiber',
    initComponent: function() {
        this.callParent(arguments);
    }
});

