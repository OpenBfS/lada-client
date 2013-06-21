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
            {
                header: 'PZW-ID',
                dataIndex: 'sprobenZusatz',
                renderer: function(value) {
                    return value.pzsId;
                }
            },
            {
                header: 'PZW-Größe',
                dataIndex: 'sprobenZusatz',
                renderer: function(value) {
                    return value.beschreibung;
                },
                flex: 1
            },
            {header: 'Messwert', dataIndex: 'messwertPzs'},
            {header: 'rel. Unsich.[%]', dataIndex: 'messfehler'},
            {
                header: 'Maßeinheit',
                dataIndex: 'sprobenZusatz',
                renderer: function(value) {
                    return value.mehId;
                }
            }
        ];
        this.callParent(arguments);
    }
});
