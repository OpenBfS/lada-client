/*
 * Window to create and edit a Kommentar
 */
Ext.define('Lada.view.kommentare.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.kommentarecreate',

    title: 'Maske für Kommentare',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.kommentare.CreateForm'
    ],
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
                handler: this.close
            }
        ];
        var form = Ext.create('Lada.view.kommentare.CreateForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
