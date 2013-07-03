Ext.define('Lada.view.messungen.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Messung',
    initComponent: function() {
        this.items = [
            {
                xtype: 'textfield',
                name: 'nebenprobenNr',
                fieldLabel: 'NPR'
            },
            {
                xtype: 'textfield',
                name: 'mmzId',
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
