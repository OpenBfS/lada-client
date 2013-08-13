/*
 * Formular to create and edit a Status
 */
Ext.define('Lada.view.status.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    requires : [
        'Lada.view.widgets.Mst',
        'Lada.view.widgets.Statuswert'
    ],
    model: 'Lada.model.Status',
    initComponent: function() {
        this.items = [
            {
                xtype: 'mst',
                label: 'Erzeuger',
                name: 'erzeuger'
            },
            {
                xtype: 'statuswert',
                label: 'Status',
                name: 'status'
            },
            {
                xtype: 'datetime',
                label: 'Datum',
                name: 'sdatum'
            },
            {
                xtype: 'textarea',
                label: 'Kommentar',
                name: 'skommentar'
            }
        ];
        this.callParent();
    }
});

