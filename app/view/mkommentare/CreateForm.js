Ext.define('Lada.view.mkommentare.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.MKommentar',
    initComponent: function() {
        this.items = [
            {
                xtype: 'textfield',
                name: 'erzeuger',
                fieldLabel: 'Erzeuger'
            },
            {
                xtype: 'datefield',
                name: 'kdatum',
                fieldLabel: 'Datum'
            },
            {
                xtype: 'textareafield',
                name: 'ktext',
                fieldLabel: 'Text'
            }
        ];
        this.callParent();
    }
});
