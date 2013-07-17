Ext.define('Lada.view.messungen.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.messungenedit',

    title: 'Maske für Messungen',
    width: Ext.getBody().getViewSize().width - 30,
    height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.messungen.EditForm'
    ],
    initComponent: function() {
        var form = Ext.create('Lada.view.messungen.EditForm', this.initialConfig);
        this.items = [form];
        this.buttons = [
            {
                text: 'Speichern',
                scope: form,
                action: 'save'
            }
        ];
        this.callParent();
    }
});
