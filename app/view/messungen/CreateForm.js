Ext.define('Lada.view.messungen.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Messung',
    requires: [
        'Lada.view.widgets.Messmethode',
        'Lada.view.widgets.Testdatensatz'
    ],
    initComponent: function() {
        this.items = [
            {
                xtype: 'textfield',
                name: 'nebenprobenNr',
                maxLength: 10,
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
            }
        ];
        this.callParent();
    }
});
