Ext.define('Lada.view.messwerte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.messwertecreate',

    title: 'Maske für Messwerte',
    //width: Ext.getBody().getViewSize().width - 30,
    //height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.messungen.CreateForm'
    ],
    initComponent: function() {
        var form = Ext.create('Lada.view.messwerte.CreateForm', this.initialConfig);
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
