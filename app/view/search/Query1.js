Ext.define('Lada.view.search.Query1' ,{
    extend: 'Ext.form.FieldSet',
    title: 'Variablenbelegung',
    alias: 'widget.query1',
    requires: [
        'Lada.view.widgets.Mst',
        'Lada.view.widgets.Uwb'
    ],
    initComponent: function() {
        this.items = [
            {
                id: 'mst',
                xtype: 'mst',
                fieldLabel: 'Messstelle',
                labelWidth: 100
            },
            {
                id: 'uwb',
                xtype: 'uwb',
                fieldLabel: 'Umweltbereich',
                labelWidth: 100
            }
        ];
        this.callParent(arguments);
    }
});
