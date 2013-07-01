Ext.define('Lada.view.orte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.ortecreate',

    title: 'Maske für Orte',
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
                scope: form,
                action: 'save'
            }
        ];
        this.callParent();
    }
});
