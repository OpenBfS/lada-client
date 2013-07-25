// Combobox for Netzbetreiber
var netzbetreiberStore = Ext.create('Ext.data.Store', {
    fields: ['netzbetreiberId', 'netzbetreiber'],
    sorters: [{
        property: 'netzbetreiber',
    }],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/netzbetreiber'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

Ext.define('Lada.view.widgets.Netzbetreiber' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.netzbetreiber',
        store: netzbetreiberStore,
        displayField:'netzbetreiber',
        valueField: 'netzbetreiberId',
        emptyText:'Wählen Sie einen Netzbetreiber',
    initComponent: function() {
        this.callParent(arguments);
    }
});

