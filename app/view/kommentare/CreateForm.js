Ext.define('Lada.view.kommentare.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Kommentar',
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
        //this.buttons = [
        //    {
        //        text: 'Speichern',
        //        handler: this.commit,
        //        scope: this
        //    }
        //];
        this.callParent();
    }
});
