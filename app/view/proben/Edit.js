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

    requires: [
        'Lada.view.proben.EditForm',
        'Lada.view.widgets.Uwb',
        'Lada.view.widgets.Datenbasis',
        'Lada.view.widgets.Probenart',
        'Lada.view.widgets.Betriebsart',
        'Lada.view.widgets.Testdatensatz',
        'Lada.view.kommentare.List'
    ],

    initComponent: function() {
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.
        var form = Ext.create('Lada.view.proben.EditForm', this.initialConfig);
        // Load kommentare
        //var record = form.getRecord();
        var kommentare = form.down('kommentarelist'); //form.down('kommentare');
        var kstore = kommentare.getStore();
        kstore.load({
            params: {
                probe: this.initialConfig['modelId']
                //probe: record.data['probeId']
            }
        });
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

