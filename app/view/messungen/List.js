Ext.define('Lada.view.messungen.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.messungenlist',
    store: 'Messungen',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Messungen gefunden.',
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
            {header: 'Mess.ID', dataIndex: "messungsId", width: 50},
            {header: 'NPR-Nr.', dataIndex: "nebenprobenNr", width: 50},
            {header: 'MMT', dataIndex: "mmtId", width: 50},
            {header: 'Messzeit', dataIndex: "messzeitpunkt"},
            {
                header: 'Status',
                dataIndex: 'id',
                renderer: function(value) {
                    var sstore = Ext.getStore('Status');
                    sstore.load({
                        params: {
                            probeId: value.probeId,
                            messungsId: value.messungsId
                        }
                    });
                    if (sstore.getTotalCount() === 0) {
                        return "unbekannt";
                    } else {
                        return sstore.last().get('status');
                    }
                }
            },
            {header: 'OK-Flag', dataIndex: "fertig"},
            {
                header: 'Anzahl Nuklide',
                dataIndex: 'id',
                renderer: function(value) {
                    var mstore = Ext.getStore('Messwerte');
                    mstore.load({
                        params: {
                            probeId: value.probeId,
                            messungsId: value.messungsId
                        }
                    });
                    return mstore.getTotalCount();
                }
            },
            {
                header: 'Anzahl Kommentare',
                flex: 1,
                dataIndex: 'id',
                renderer: function(value) {
                    var kstore = Ext.getStore('MKommentare');
                    kstore.load({
                        params: {
                            probeId: value.probeId,
                            messungsId: value.messungsId
                        }
                    });
                    return kstore.getTotalCount();
                }
            }
        ];
        this.callParent(arguments);
    }
});

