/*
 * Window to create and edit a Messwert
 */
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
            },
            {
                text: 'Abbrechen',
                scope: this,
                handler: this.close,
            }
        ];
        var form = Ext.create('Lada.view.messwerte.CreateForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
