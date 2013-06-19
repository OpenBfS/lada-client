Ext.define('Lada.view.orte.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Ort',
    initComponent: function() {
        this.items = [
            //{
            //    xtype: 'textfield',
            //    name: 'erzeuger',
            //    fieldLabel: 'Erzeuger'
            //},
            //{
            //    xtype: 'datefield',
            //    name: 'kdatum',
            //    fieldLabel: 'Datum'
            //},
            //{
            //    xtype: 'textareafield',
            //    name: 'ktext',
            //    fieldLabel: 'Text'
            //}
        ];
        this.callParent();
    }
});
