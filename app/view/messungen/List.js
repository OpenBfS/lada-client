/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Messungen
 */
Ext.define('Lada.view.messungen.List', {
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
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        this.plugins = [rowEditing];
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Details',
                icon: 'gfx/document-open.png',
                action: 'open'
            }, {
                text: 'Hinzufügen',
                icon: 'gfx/list-add.png',
                action: 'add',
                probeId: this.probeId
            }, {
                text: 'Löschen',
                icon: 'gfx/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'Mess.ID',
            editor: {
                allowBlank: false
            },
            dataIndex: 'id',
            width: 50
        }, {
            header: 'NPR-Nr.',
            editor: {
                allowBlank: false
            },
            dataIndex: 'nebenprobenNr',
            width: 50
        }, {
            header: 'MMT',
            editor: {
                allowBlank: false
            },
            dataIndex: 'mmtId',
            width: 50
        }, {
            header: 'Messzeit',
            editor: {
                xtype: 'datefield',
                allowBlank: false,
                format: 'd.m.Y',
                minValue: '01.01.2001', // TODO: gibt es ein minValue?
                //minText: 'Fehlertext', // TODO: Fehlertext falls minValue
                maxValue: Ext.Date.format(new Date(), 'd.m.Y')
            },
            dataIndex: 'messzeitpunkt'
        }, {
            header: 'Status',
            dataIndex: 'id',
            width: 50,
            renderer: function(value) {
                var sstore = Ext.getStore('Status');
                sstore.load({
                    params: {
                        probeId: value.probeId,
                        messungsId: value.id
                    }
                });
                if (sstore.getTotalCount() === 0) {
                    return 'unbekannt';
                }
                return sstore.last().get('status');
            },
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, {
            header: 'OK-Flag',
            dataIndex: 'fertig',
            width: 50,
            renderer: function(value) {
                if (value) {
                    return 'Ja';
                }
                return 'Nein';
            },
            editor: {
                xtype: 'checkboxfield',
                allowBlank: false
            }
         }, {
            header: 'Anzahl Nuklide',
            dataIndex: 'id',
            renderer: function(value) {
                var mstore = Ext.getStore('Messwerte');
                mstore.load({
                    params: {
                        probeId: value.probeId,
                        messungsId: value.id
                    }
                });
                return mstore.getTotalCount();
            }
        }, {
            header: 'Anzahl Kommentare',
            flex: 1,
            dataIndex: 'id',
            renderer: function(value) {
                var kstore = Ext.getStore('KommentareM');
                kstore.load({
                    params: {
                        probeId: value.probeId,
                        messungsId: value.id
                    }
                });
                return kstore.getTotalCount();
            }
        }];
        this.callParent(arguments);
    }
});
