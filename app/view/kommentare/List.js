Ext.define('Lada.view.kommentare.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.kommentarelist',
    store: 'Kommentare',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Kommentaregefunden.',
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
            {header: 'Datum', dataIndex: 'kdatum'},
            {header: 'Text', dataIndex: 'ktext', flex: 1}
        ];
        this.callParent(arguments);
    }
});

