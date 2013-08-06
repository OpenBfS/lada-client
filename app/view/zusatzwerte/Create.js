Ext.define('Lada.view.zusatzwerte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.zusatzwertecreate',

    title: 'Maske für Zusatzwerte',
    autoShow: true,
    autoScroll: true,
    modal: true,

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
        var form = Ext.create('Lada.view.zusatzwerte.CreateForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
