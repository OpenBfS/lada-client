Ext.define('Lada.view.kommentare.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.kommentaredit',

    title: 'Maske für Kommentare',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    width: Ext.getBody().getViewSize().width - 30,
    maxHeight: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
    ],

    initComponent: function() {
        this.items = [
            {
                //Define the form
                xtype: 'form',
                bodyPadding: '10 10',
                border: 0,
                layout: 'fit',
                items: [
                    {
                        xtype: 'textfield',
                        name: 'erzeuger',
                        fieldLabel: 'Erzeuger'
                    },
                    {
                        xtype: 'textfield',
                        name: 'kdatum',
                        fieldLabel: 'Datum'
                    },
                    {
                        xtype: 'textareafield',
                        name: 'ktext',
                        fieldLabel: 'Text'
                    }
                ]
            }
        ];
        this.buttons = [
            {
                text: 'Speichern',
                action: 'save'
            },
            {
                text: 'Verwerfen',
                scope: this,
                handler: this.close
            }
        ];
        this.callParent(arguments);
    }
});

