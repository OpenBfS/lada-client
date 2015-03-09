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
Ext.define('Lada.view.grid.Messungen', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.messungengrid',

    maxHeight: 350,
    emptyText: 'Keine Messungen gefunden',
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    recordId: null,

    warnings: null,
    errors: null,

    initComponent: function() {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            itemId: 'rowedit'
        });
        this.plugins = [rowEditing];
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Details',
                icon: 'resources/img/document-open.png',
                action: 'open',
                disabled: true
            }, {
                text: 'Hinzufügen',
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.recordId
            }, {
                text: 'Löschen',
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'Mess-ID',
            dataIndex: 'id',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
        /*
            header: 'Probe-ID',
            dataIndex: 'probeId',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
        */
            header: 'Nebenproben-Nr.',
            dataIndex: 'nebenprobenNr',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
            header: 'MMT',
            dataIndex: 'mmtId',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Messzeit',
            dataIndex: 'messzeitpunkt',
            flex: 2,
            editor: {
                xtype: 'datefield',
                allowBlank: false,
                format: 'd.m.Y',
                //minValue: '01.01.2001', //todo: gibt es das?
                //minText: 'Das Datum der Messung darf nicht vor dem 01.01.2001 liegen.',
                maxValue: Ext.Date.format(new Date(), 'd.m.Y')
            }
        }
        /*
         , {
            header: 'Messdauer',
            dataIndex: 'messdauer',
            width: 50,
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Geplant',
            dataIndex: 'geplant',
            width: 10,
            editor: {
                xtype: 'checkboxfield',
                allowBlank: false
            }
        }, {
            header: 'Letzte Änderung',
            dataIndex: 'letzteAenderung',
            width: 50,
            editor: {
                xtype: 'datefield',
                allowBlank: false,
                format: 'd.m.Y',
                //minValue: '01.01.2001', //todo: gibt es das?
                //minText: 'Das Datum der letzten Änderung darf nicht vor dem 01.01.2001 liegen.',
                maxValue: Ext.Date.format(new Date(), 'd.m.Y')
            }
        }*/
        , {
            header: 'Status',
            dataIndex: 'id',
            flex: 1,
            renderer: function(value) {
                var sstore = Ext.getStore('Status'); // Es existiert derzeit kein StatusModel. Der Status Store referenziert jedoch darauf.
                sstore.load({
                    params: {
                        probeId: value.recordId,
                        messungsId: value.id
                    }
                });
                if (sstore.getTotalCount() === 0) {
                    return 'unbekannt';
                }
                return sstore.last().get('status');
            }
        }, {
            header: 'OK-Flag',
            dataIndex: 'fertig',
            flex: 1,
            renderer: function(value){
                if(value){
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
            flex: 1,
            renderer: function(value) {
                var mstore = Ext.getStore('Messwerte');
                mstore.load({
                    params: {
                        probeId: value.recordId,
                        messungsId: value.id
                    }
                });
                return mstore.getTotalCount();
            }
        }, {
            header: 'Anzahl Kommentare',
            flex: 1,
            renderer: function(value) {
                var kstore = Ext.getStore('MKommentare');
                kstore.load({
                    params: {
                        probeId: value.probeId,
                        messungsId: value.id
                    }
                });
                return kstore.getTotalCount();
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function(){
        this.store = Ext.create('Lada.store.Messungen');
        this.store.load({
            params: {
                probeId: this.recordId
            }
        });
    },
    listeners: {
        selectionchange: function(model, selected, eOpts) {
            /*
            * Enable the 'details' button only when an item is selected
            */
            if (selected.length > 0) {
                this.down('button[action=open]').enable();
            }
        }
    }
});
