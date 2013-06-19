Ext.define('Lada.view.zusatzwerte.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Zusatzwert',
    initComponent: function() {
        this.items = [
            {
                xtype: 'zusatzwert',
                name: 'pzsId',
                fieldLabel: 'PWZ-ID'
            },
            {
                xtype: 'textfield',
                name: 'erzeuger',
                fieldLabel: 'PWZ-Größe'
            },
            {
                xtype: 'textfield',
                name: 'messwertNwg',
                fieldLabel: '&lt;NWG'
            },
            {
                xtype: 'textfield',
                name: 'messwertPzs',
                fieldLabel: '&lt;PZW'
            },
            {
                xtype: 'textfield',
                name: 'messfehler',
                fieldLabel: 'rel. Unsich.[%]'
            },
            {
                xtype: 'messeinheit',
                name: 'mehId',
                fieldLabel: 'Maßeinheit'
            }
        ];
        this.callParent();
    }
});
