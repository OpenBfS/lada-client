Ext.define('Lada.view.zusatzwerte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.zusatzwertecreate',

    title: 'Maske für Zusatzwerte',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    width: Ext.getBody().getViewSize().width - 30,
    height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    initComponent: function() {
        var form = Ext.create('Lada.view.zusatzwerte.CreateForm', this.initialConfig);
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
