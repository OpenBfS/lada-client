Ext.define('Lada.view.messungen.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.messungencreate',

    title: 'Maske für Messungen',
    width: Ext.getBody().getViewSize().width - 30,
    height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.messungen.CreateForm'
    ],
    initComponent: function() {
        var form = Ext.create('Lada.view.messungen.CreateForm', this.initialConfig);
        this.items = [form];
        this.buttons = [
            {
                text: 'Speichern',
                scope: form
            }
        ];
        this.callParent();
    }
});
