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

/**
 * Combobox for Datenbasis
 */
Ext.define('Lada.view.widgets.Datenbasis' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.datenbasis',
        store: datenbasisStore,
        displayField:'datenbasis',
        valueField: 'datenbasisId',
        emptyText:'Wählen Sie eine Datenbasis',
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
