Ext.define('Lada.view.messwerte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.messwertecreate',

    title: 'Maske für Messwerte',
    autoShow: true,
    autoScroll: true,
    modal: true,

    initComponent: function() {
        this.buttons = [
            {
                text: 'Speichern',
                scope: form,
                action: 'save'
            }
        ];
        var form = Ext.create('Lada.view.messwerte.CreateForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
