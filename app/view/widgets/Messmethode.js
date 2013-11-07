var mmtStore = Ext.create('Ext.data.Store', {
    fields: ['mmtId', 'messmethhode'],
    sorters: [{
        property: 'mmtId'
    }],
    autoLoad: true,
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

/**
 * Combobox for Messmethode
 */
Ext.define('Lada.view.widgets.Messmethode' ,{
        tpl: '<tpl for="."><div class="x-combo-list-item x-boundlist-item" >{mmtId} - {messmethhode}</div></tpl>',
        extend: 'Ext.form.ComboBox',
        alias: 'widget.messmethode',
        store: mmtStore,
        displayField:'messmethhode',
        valueField: 'mmtId',
        emptyText:'Wählen Sie eine Messmethode',
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
