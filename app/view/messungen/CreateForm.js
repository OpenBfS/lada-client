Ext.define('Lada.view.messungen.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Messung',
    requires: [
        'Lada.view.widgets.Messmethode',
        'Lada.view.mkommentare.List'
    ],
    initComponent: function() {
        this.items = [
            {
                xtype: 'textfield',
                name: 'nebenprobenNr',
                fieldLabel: 'NPR'
            },
            {
                xtype: 'messmethode',
                name: 'mmtId',
                fieldLabel: 'MMT'
            },
            {
                xtype: 'datefield',
                name: 'messzeitpunkt',
                fieldLabel: 'Messzeitpunkt'
            },
            {
                xtype: 'textfield',
                name: 'messdauer',
                fieldLabel: 'Messdauer'
            },
            {
                xtype: 'textfield',
                name: 'fertig',
                fieldLabel: 'Fertig'
            },
            {
                xtype: 'textfield',
                name: 'geplant',
                fieldLabel: 'Geplant'
            },
            // Messungskommentare
            {
                xtype: 'fieldset',
                title: 'Messungskommentare',
                collapsible: true,
                collapsed: false,
                padding: '10 10',
                items: [
                    {
                        xtype: 'mkommentarelist',
                        parentId: this.modelId
                    }
                ]
            }
        ];
        this.callParent();
    }
});
