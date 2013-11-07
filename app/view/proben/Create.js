/*
 * Window to create a Probe
 */
Ext.define('Lada.view.proben.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.probencreate',

    title: 'Maske für §3-Proben',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    width: Ext.getBody().getViewSize().width - 30,
    height: Ext.getBody().getViewSize().height - 30,
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
        var form = Ext.create('Lada.view.proben.CreateForm');
        this.items = [form];
        this.callParent();
    }
});
