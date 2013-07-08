Ext.define('Lada.view.messwerte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.messwertecreate',

    title: 'Maske für Messwerte',
    autoShow: true,
    autoScroll: true,
    modal: true,

    initComponent: function() {
        var form = Ext.create('Lada.view.messwerte.CreateForm', this.initialConfig);
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
