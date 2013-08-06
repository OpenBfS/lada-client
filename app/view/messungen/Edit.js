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
        this.buttons = [
            {
                text: 'Speichern',
                scope: form,
                action: 'save'
            },
            {
                text: 'Abbrechen',
                scope: this,
                handler: this.close,
            }
        ];
        var form = Ext.create('Lada.view.messungen.EditForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
