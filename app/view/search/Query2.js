Ext.define('Lada.view.search.Query2' ,{
    extend: 'Ext.form.FieldSet',
    alias: 'widget.query2',
    title: 'Variablenbelegung (Zeiten in UTC)',
    requires: [
        'Lada.view.widgets.Datetime'
    ],
    initComponent: function() {
        this.items = [
            {
                id: 'pbegin',
                xtype: 'datetime',
                fieldLabel: 'Probenbeginn',
                labelWidth: 100
            }
        ];
        this.callParent(arguments);
    }
});
