Ext.define('Lada.view.messwerte.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Messwert',
    requires: [
    //    'Lada.view.widgets.Messmethode',
        'Lada.view.widgets.Messgroesse',
        'Lada.view.widgets.Messeinheit'
    //    'Lada.view.mkommentare.List',
    //    'Lada.view.status.List',
    //    'Lada.view.messwerte.List'
    ],
    initComponent: function() {
        this.items = [
            {
                xtype: 'textfield',
                name: 'messwert',
                fieldLabel: 'Messwert'
            },
            {
                xtype: 'textfield',
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
                xtype: 'textfield',
                name: 'nwgZuMesswert',
                fieldLabel: 'Nachweisgrenze'
            }
            //{
            //    xtype: 'datefield',
            //    name: 'messzeitpunkt',
            //    fieldLabel: 'Messzeitpunkt'
            //},
            //{
            //    xtype: 'textfield',
            //    name: 'messdauer',
            //    fieldLabel: 'Messdauer'
            //},
            //{
            //    xtype: 'testdatensatz',
            //    name: 'fertig',
            //    fieldLabel: 'Fertig'
            //},
            //{
            //    xtype: 'testdatensatz',
            //    name: 'geplant',
            //    fieldLabel: 'Geplant'
            //},
            //// Messwerte
            //{
            //    xtype: 'fieldset',
            //    title: 'Messwerte',
            //    collapsible: true,
            //    collapsed: false,
            //    padding: '10 10',
            //    items: [
            //        {
            //            xtype: 'messwertelist',
            //            parentId: this.modelId
            //        }
            //    ]
            //},
            //// Status
            //{
            //    xtype: 'fieldset',
            //    title: 'Messungsstatus',
            //    collapsible: true,
            //    collapsed: false,
            //    padding: '10 10',
            //    items: [
            //        {
            //            xtype: 'statuslist',
            //            parentId: this.modelId
            //        }
            //    ]
            //},
            //// Messungskommentare
            //{
            //    xtype: 'fieldset',
            //    title: 'Messungskommentare',
            //    collapsible: true,
            //    collapsed: false,
            //    padding: '10 10',
            //    items: [
            //        {
            //            xtype: 'mkommentarelist',
            //            parentId: this.modelId
            //        }
            //    ]
            //}
        ];
        this.callParent();
    }
});
