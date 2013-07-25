// Combobox for Datenbasis
var datenbasisStore = Ext.create('Ext.data.Store', {
    fields: ['datenbasisId', 'beschreibung', 'datenbasis'],
    sorters: [{
        property: 'datenbasis',
    }],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/datenbasis'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

Ext.define('Lada.view.widgets.Datenbasis' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.datenbasis',
        store: datenbasisStore,
        displayField:'datenbasis',
        valueField: 'datenbasisId',
        emptyText:'Wählen Sie eine Datenbasis',
    initComponent: function() {
        this.callParent(arguments);
    }
});
