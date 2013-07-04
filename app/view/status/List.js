Ext.define('Lada.view.status.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.statuslist',
    store: 'Status',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Statusangaben gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 35,
        deferEmptyText: false
    },
    probeId: null,
    initComponent: function() {
        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        text: 'Hinzufügen',
                        icon: 'gfx/plus.gif',
                        action: 'add',
                        probeId: this.probeId
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
            {header: 'Erzeuger', dataIndex: 'erzeuger'},
            {header: 'Status', dataIndex: 'status'},
            {header: 'Datum', dataIndex: 'sdatum'},
            {header: 'Text', dataIndex: 'stext', flex: 1}
        ];
        this.callParent(arguments);
    }
});

