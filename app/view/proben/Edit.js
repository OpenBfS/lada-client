Ext.define('Lada.view.proben.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.probenedit',

    title: 'Maske für §3-Proben',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    width: Ext.getBody().getViewSize().width - 30,
    height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    initComponent: function() {
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.
        var form = Ext.create('Lada.view.proben.EditForm', this.initialConfig);
        this.items = [form];
        this.buttons = [
            {
                text: 'Speichern',
                handler: form.commit,
                scope: form
            }
        ];
        this.callParent();
    }
});

