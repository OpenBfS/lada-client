// Combobox for Messtelle
Ext.define('Lada.view.widgets.Mst' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.mst',
        store: 'Mst',
        displayField:'mstId',
        valueField: 'mstId',
        typeAhead: true,
        emptyText:'Wählen Sie eine Messstelle',
    initComponent: function() {
        this.callParent(arguments);
    }
});
