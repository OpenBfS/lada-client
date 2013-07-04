// Combobox for Messmethode
var mmtStore = Ext.create('Ext.data.Store', {
    fields: ['mmtId', 'messmethhode'],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/messmethode'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

Ext.define('Lada.view.widgets.Messmethode' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.messmethode',
        store: mmtStore,
        displayField:'messmethhode',
        valueField: 'mmtId',
        emptyText:'Wählen Sie eine Messmethode',
    initComponent: function() {
        this.callParent(arguments);
    }
});
