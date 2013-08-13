/*
 * Formular to create and edit a Messwert
 */
Ext.define('Lada.view.messwerte.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Messwert',
    requires: [
        'Lada.view.widgets.Messgroesse',
        'Lada.view.widgets.Messeinheit'
    ],
    initComponent: function() {
        this.items = [
            {
                xtype: 'numberfield',
                name: 'messwert',
                fieldLabel: 'Messwert'
            },
            {
                xtype: 'numberfield',
                name: 'messfehler',
                fieldLabel: 'Messfehler'
            },
            {
                xtype: 'messgroesse',
                name: 'messgroesseId',
                fieldLabel: 'Messgroesse'
            },
            {
                xtype: 'messeinheit',
                name: 'mehId',
                fieldLabel: 'Messeinheit'
            },
            {
                xtype: 'numberfield',
                name: 'nwgZuMesswert',
                fieldLabel: 'Nachweisgrenze'
            }
        ];
        this.callParent();
    }
});
