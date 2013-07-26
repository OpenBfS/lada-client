// Combobox for Messmethode
var mmtStore = Ext.create('Ext.data.Store', {
    fields: ['mmtId', 'messmethhode'],
    sorters: [{
        property: 'mmtId',
    }],
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
        tpl: '<tpl for="."><div class="x-combo-list-item" >{mmtId} - {messmethhode}</div></tpl>',
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
