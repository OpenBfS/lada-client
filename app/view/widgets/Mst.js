var mstStore = Ext.create('Ext.data.Store', {
    fields: ['mstId', 'messStelle'],
    sorters: [{
        property: 'messStelle',
    }],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/mst'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

/**
 * Combobox for Messstelle
 */
Ext.define('Lada.view.widgets.Mst' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.mst',
        store: mstStore,
        displayField:'messStelle',
        valueField: 'mstId',
        typeAhead: true,
        emptyText:'Wählen Sie eine Messstelle',
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
