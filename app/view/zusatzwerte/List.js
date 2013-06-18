Ext.define('Lada.view.zusatzwerte.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.zusatzwertelist',
    store: 'Zusatzwerte',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Zusatzwerte gefunden.',
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
            {header: 'PZW-ID', dataIndex: 'pzsId'},
            {header: 'PWZ-Größe', dataIndex: ''},
            {header: '&lt;NWG', dataIndex: 'messwertNwg'},
            {header: '&lt;PZW', dataIndex: 'messwertPzs'},
            {header: 'rel. Unsich.[%]', dataIndex: 'messfehler'},
            {header: 'Maßeinheit', dataIndex: ''}
        ];
        this.callParent(arguments);
    }
});
