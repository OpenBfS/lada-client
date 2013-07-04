Ext.define('Lada.view.messungen.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Messung',
    requires: [
        'Lada.view.widgets.Messmethode'
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
            }
        ];
        this.callParent();
    }
});
