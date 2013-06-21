// Combobox for Probenart
var probenartStore = Ext.create('Ext.data.Store', {
    fields: ['probenartId', 'probenart'],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/probenart'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

Ext.define('Lada.view.widgets.Probenart' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.probenart',
        store: probenartStore,
        displayField:'probenart',
        valueField: 'probenartId',
        emptyText:'Wählen Sie eine Probenart',
    initComponent: function() {
        this.callParent(arguments);
    }
});
