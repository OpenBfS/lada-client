Ext.define('Lada.view.messungen.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Messung',
    requires: [
        'Lada.view.widgets.Messmethode',
        'Lada.view.widgets.Testdatensatz',
        'Lada.view.mkommentare.List',
        'Lada.view.status.List',
        'Lada.view.messwerte.List'
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
                xtype: 'testdatensatz',
                name: 'fertig',
                fieldLabel: 'Fertig'
            },
            {
                xtype: 'testdatensatz',
                name: 'geplant',
                fieldLabel: 'Geplant'
            },
            // Messwerte
            {
                xtype: 'fieldset',
                title: 'Messwerte',
                collapsible: true,
                collapsed: false,
                padding: '10 10',
                items: [
                    {
                        xtype: 'messwertelist',
                        parentId: this.model.get('messungsId'),
                        probeId: this.model.get('probeId')
                    }
                ]
            },
            // Status
            {
                xtype: 'fieldset',
                title: 'Messungsstatus',
                collapsible: true,
                collapsed: false,
                padding: '10 10',
                items: [
                    {
                        xtype: 'statuslist',
                        parentId: this.model.get('messungsId'),
                        probeId: this.model.get('probeId')
                    }
                ]
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
                        parentId: this.model.get('messungsId'),
                        probeId: this.model.get('probeId')
                    }
                ]
            }
        ];
        this.callParent();
    }
});
