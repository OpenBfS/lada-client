Ext.define('Lada.view.zusatzwerte.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Zusatzwert',
    initComponent: function() {
        this.items = [
            {
                xtype: 'zusatzwert',
                name: 'sprobenZusatz_pzsId',
                fieldLabel: 'PZW-Größe'
            },
            {
                xtype: 'textfield',
                name: 'messwertPzs',
                fieldLabel: 'Messwert'
            },
            {
                xtype: 'textfield',
                name: 'messfehler',
                fieldLabel: 'rel. Unsich.[%]'
            },
            {
                xtype: 'textfield',
                name: 'nwgZuMesswert',
                fieldLabel: 'Nachweisgrenze'
            }
        ];
        this.callParent();
    }
});
