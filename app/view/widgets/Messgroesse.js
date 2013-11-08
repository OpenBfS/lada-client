/**
 * Combobox for Messgroesse
 */
Ext.define('Lada.view.widgets.Messgroesse' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.messgroesse',
        store: 'Messgroessen',
        displayField: 'messgro0esse',
        valueField: 'messgroesseId',
        emptyText:'Wählen Sie eine Messgröße',
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
