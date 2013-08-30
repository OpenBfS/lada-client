/*
 * Grid to list Messwerte
 */
Ext.define('Lada.view.messwerte.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.messwertelist',
    store: 'Messwerte',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Messwerte gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 35,
        deferEmptyText: false
    },
    probeId: null,
    parentId: null,
    initComponent: function() {
        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        text: 'Hinzufügen',
                        icon: 'gfx/list-add.png',
                        action: 'add',
                        probeId: this.probeId,
                        parentId: this.parentId
                    },
                    {
                        text: 'Löschen',
                        icon: 'gfx/list-remove.png',
                        action: 'delete'
                    }
                ]
            }
        ];
        this.columns = [
            {header: 'Messwert', dataIndex: 'messwert'},
            {header: 'Messfehler', dataIndex: 'messfehler'},
            {
                header: 'Messgröße',
                dataIndex: 'messgroesseId',
                renderer: function(value) {
                    var store = Ext.getStore('Messgroessen');
                    return store.findRecord('messgroesseId', value).get('messgro0esse');
                }
            },
            {
                header: 'Messeinheit',
                dataIndex: 'mehId',
                renderer: function(value) {
                    var store = Ext.getStore('Messeinheit');
                    return store.findRecord('mehId', value).get('einheit');
                }
            },
            {
                header: 'Grenzwertüberschreitung',
                dataIndex: 'grenzwertueberschreitung',
                flex: 1,
                renderer: function(value) {
                    if (value === true) {
                        return "Ja";
                    } else {
                        return "Nein";
                    }
                }
            }
        ];
        this.callParent(arguments);
    }
});

