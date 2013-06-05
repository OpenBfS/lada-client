Ext.define('Lada.view.proben.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.probencreate',

    title: 'Maske für §3-Proben',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    width: Ext.getBody().getViewSize().width - 30,
    height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.proben.CreateForm',
        'Lada.view.widgets.Uwb',
        'Lada.view.widgets.Datenbasis',
        'Lada.view.widgets.Probenart',
        'Lada.view.widgets.Betriebsart',
        'Lada.view.widgets.Testdatensatz'
    ],
    initComponent: function() {
        var form = Ext.create('Lada.view.proben.CreateForm');
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
