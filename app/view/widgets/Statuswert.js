var statuswerteStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'status'],
    data: [
        {"id":1, "status":"nicht vergeben"},
        {"id":2, "status":"plausibel"},
        {"id":3, "status":"nicht repräsentativ"},
        {"id":4, "status":"nicht plausibel"}
    ]
});

/**
 * Combobox for Statuswert
 */
Ext.define('Lada.view.widgets.Statuswert' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.statuswert',
        store: statuswerteStore,
        displayField:'status',
        valueField: 'id',
        typeAhead: true,
        emptyText:'Wählen Sie eine Status',
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
