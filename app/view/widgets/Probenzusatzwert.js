/**
 * Combobox for Zusatzwert
 */
Ext.define('Lada.view.widgets.Zusatzwert' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.probenzusatzwert',
        store: 'Probenzusatzwerte',
        displayField: 'beschreibung',
        valueField: 'pzsId',
        emptyText:'Wählen Sie einen Zusatzwert',
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
