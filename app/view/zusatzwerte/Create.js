Ext.define('Lada.view.zusatzwerte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.zusatzwertecreate',

    title: 'Maske für Zusatzwerte',
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
