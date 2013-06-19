Ext.define('Lada.view.orte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.ortecreate',

    title: 'Maske für Orte',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    width: Ext.getBody().getViewSize().width - 30,
    height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.orte.CreateForm'
    ],
    initComponent: function() {
        var form = Ext.create('Lada.view.orte.CreateForm');
        this.items = [form];
        this.buttons = [
            {
                text: 'Speichern',
                handler: form.commit,
                scope: form
            }
        ];
        this.callParent();
    }
});
