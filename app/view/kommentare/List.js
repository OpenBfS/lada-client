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
    initComponent: function() {
        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        text: 'Hinzufügen',
                        icon: 'gfx/plus.gif'
                    },
                    {
                        text: 'Löschen',
                        icon: 'gfx/minus.gif'
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

