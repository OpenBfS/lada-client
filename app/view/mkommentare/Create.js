Ext.define('Lada.view.mkommentare.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.mkommentarecreate',

    title: 'Maske für Messungskommentare',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.mkommentare.CreateForm'
    ],
    initComponent: function() {
        var form = Ext.create('Lada.view.mkommentare.CreateForm', this.initialConfig);
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
