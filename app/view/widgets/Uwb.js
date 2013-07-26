// Combobox for Umweltbereich
var uwbStore = Ext.create('Ext.data.Store', {
    fields: ['umwId', 'umweltBereich'],
    sorters: [{
        property: 'umwId',
    }],
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/uwb'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

Ext.define('Lada.view.widgets.Uwb' ,{
        tpl: '<tpl for="."><div class="x-combo-list-item" >{umwId} - {umweltBereich}</div></tpl>',
        extend: 'Ext.form.ComboBox',
        alias: 'widget.uwb',
        store: uwbStore,
        displayField:'umwId',
        valueField: 'umwId',
        emptyText:'Wählen Sie einen Umweltbereich',
    initComponent: function() {
        this.callParent(arguments);
    }
});
