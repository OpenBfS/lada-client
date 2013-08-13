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

/**
 * Combobox for Probenart
 */
Ext.define('Lada.view.widgets.Probenart' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.probenart',
        store: probenartStore,
        displayField:'probenart',
        valueField: 'probenartId',
        emptyText:'Wählen Sie eine Probenart',
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
