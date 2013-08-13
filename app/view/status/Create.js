/*
 * Window to create and edit a Status
 */
Ext.define('Lada.view.status.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.statuscreate',

    title: 'Maske für den Messstatus',
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
        var form = Ext.create('Lada.view.status.CreateForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
