Ext.define('Lada.view.kommentare.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.kommentarecreate',

    title: 'Maske für Kommentare',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    width: Ext.getBody().getViewSize().width - 30,
    height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.kommentare.CreateForm'
    ],
    initComponent: function() {
        var form = Ext.create('Lada.view.kommentare.CreateForm', this.initialConfig);
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
