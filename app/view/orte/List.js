Ext.define('Lada.view.orte.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.ortelist',
    store: 'Orte',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Orte gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 35,
        deferEmptyText: false
    },
    initComponent: function() {
        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        text: 'Hinzufügen',
                        icon: 'gfx/plus.gif',
                        action: 'add'
                    },
                    {
                        text: 'Löschen',
                        icon: 'gfx/minus.gif',
                        action: 'delete'
                    }
                ]
            }
        ];
        this.columns = [
            {header: 'Typ', dataIndex: 'otyp'},
            {header: 'ID', dataIndex: 'ortId'},
            {header: 'Staat', dataIndex: ''},
            {header: 'Gem-ID', dataIndex: ''},
            {header: 'Gemeindebezeichnung', dataIndex: 'bezeichnung'},
            {header: 'Messpunkt', dataIndex: ''}
        ];
        this.callParent(arguments);
    }
});

