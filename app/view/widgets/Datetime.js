// Combobox for Time and Dates
Ext.define('Lada.view.widgets.Datetime' ,{
        extend: 'Ext.ux.form.DateTimeField',
        alias: 'widget.datetime',
        format: 'd.m.Y',
        emptyText:'Wählen Sie einen Zeitpunkt',
    initComponent: function() {
        this.callParent(arguments);
    }
});
