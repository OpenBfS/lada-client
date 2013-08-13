/**
 * Combobox for Messgroesse
 */
Ext.define('Lada.view.widgets.Messegroesse' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.messgroesse',
        store: 'Messgroessen',
        displayField: 'messgro0esse',
        valueField: 'messgroesseId',
        emptyText:'Wählen Sie eine Messgröße',
        forceSelection: true,
        autoSelect: false,
        queryMode: 'local',
        triggerAction : 'all',
        typeAhead: true,
        minChars: 0,

    initComponent: function() {
        this.callParent(arguments);
    }
});
