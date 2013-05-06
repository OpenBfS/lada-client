Ext.define('Lada.view.proben.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.probenedit',

    title: 'Maske für §3-Proben',
    layout: 'fit',
    autoShow: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                items: [
                    {
                        xtype: 'textfield',
                        name : 'probeId',
                        fieldLabel: 'ID'
                    },
                    {
                        xtype: 'textfield',
                        name : 'datenbasisId',
                        fieldLabel: 'Datenbasis'
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
