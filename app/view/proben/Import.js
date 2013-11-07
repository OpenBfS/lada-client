/*
 * Window to import a Probe
 */
Ext.define('Lada.view.proben.Import', {
    extend: 'Ext.window.Window',
    alias: 'widget.probenimport',

    title: 'Maske für §3-Proben Import',
    autoShow: true,
    autoScroll: true,
    modal: true,
    initComponent: function() {
        this.buttons = [
            {
                text: 'Speichern',
                action: 'save'
            },
            {
                text: 'Abbrechen',
                scope: this,
                handler: this.close
            }
        ];
        var form = Ext.create('Lada.view.proben.ImportForm');
        this.items = [form];
        this.callParent();
    }
});
