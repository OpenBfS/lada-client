var nwgStore = Ext.create('Ext.data.Store', {
    fields: ['nwgId', 'nwg'],
    data: [
        {"nwgId":"", "nwg":">="},
        {"nwgId":"<", "nwg":"<"}
    ]
});

/**
 * Combobox for Nachweisgrenze.
 */
Ext.define('Lada.view.widgets.Nwg' ,{
        extend: 'Ext.form.ComboBox',
        editable: false,
        alias: 'widget.nwg',
        store: nwgStore,
        queryMode: 'local',
        displayField:'nwg',
        valueField: 'nwgId',
        emptyText:'Messwert kleiner als Nachweisgrenze?',
    initComponent: function() {
        this.callParent(arguments);
    }
});
