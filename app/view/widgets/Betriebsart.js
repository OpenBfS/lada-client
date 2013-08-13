var betriebsartStore = Ext.create('Ext.data.Store', {
    fields: ['betriebsartId', 'betriebsart'],
    data: [
        {"betriebsartId":"1", "betriebsart":"Normal-/Routinebtrieb"},
        {"betriebsartId":"2", "betriebsart":"Störfall/Intensivbetrieb"}
    ]
});

/**
 * Combobox for Betriebsart
 */
Ext.define('Lada.view.widgets.Betriebsart' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.betriebsart',
        store: betriebsartStore,
        queryMode: 'local',
        displayField:'betriebsart',
        valueField: 'betriebsartId',
        emptyText:'Wählen Sie eine Betriebsart',
    initComponent: function() {
        this.callParent(arguments);
    }
});
