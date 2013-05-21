// Combobox for Time and Dates
Ext.define('Lada.view.widgets.Datetime' ,{
        extend: 'Ext.form.Date',
        alias: 'widget.datetime',
        emptyText:'Wählen Sie einen Zeitpunkt',
    initComponent: function() {
        this.callParent(arguments);
    }
});
