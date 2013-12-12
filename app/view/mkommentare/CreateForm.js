/*
 * Formular to create and edit a Kommentar for Messungen
 */
Ext.define('Lada.view.mkommentare.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.MKommentar',
    initComponent: function() {
        this.items = [
            {
                xtype: 'mst',
                name: 'erzeuger',
                fieldLabel: 'Erzeuger'
            },
            {
                xtype: 'datetime',
                name: 'kdatum',
                fieldLabel: 'Datum'
            },
            {
                xtype: 'textareafield',
                maxLength: 1024,
                name: 'ktext',
                fieldLabel: 'Text'
            }
        ];
        this.callParent();
    }
});
