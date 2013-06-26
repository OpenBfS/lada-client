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
            {
                header: 'PZW-ID',
                dataIndex: 'pzsId'
            },
            {
                header: 'PZW-Größe',
                dataIndex: 'pzsId',
                renderer: function(value) {
                    var store = Ext.getStore('Probenzusatzwerte');
                    var record = store.getById(value);
                    return record.get('beschreibung');
                },
                flex: 1
            },
            {header: 'Messwert', dataIndex: 'messwertPzs'},
            {header: 'rel. Unsich.[%]', dataIndex: 'messfehler'},
            {
                header: 'Maßeinheit',
                dataIndex: 'pzsId',
                renderer: function(value) {
                    var store = Ext.getStore('Probenzusatzwerte');
                    var record = store.getById(value);
                    return record.get('mehId');
                }
            }
        ];
        this.callParent(arguments);
    }
});
