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
                probeId: this.probeId
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
        }, {
            header: 'Status',
            flex: 1,
            dataIndex: 'id',
            renderer: function(value) {
//fixme: dezeit existiert nur 1 status daher immer unbekannt
                this.statusStore.load(
                {
                    params: {
                        messungsId: value,
                    }
                });

                if (!this.statusStore){
                    return 'unbekannt';
                }
                if (this.statusStore.getTotalCount() === 0) {
                    return 'unbekannt';
                }
                return this.statusStore.last().get('status');
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
            // Gibt die Anzahl der Messwerte wieder,
            // NICHT die Anzahl der verschiedenen Nukleide
            // Eventuell ist die Bezeichnug daher irreführend
            flex: 1,
            dataIndex: 'id',
            renderer: function(value) {
//fixme: gibt immer 0 aus
                this.messwerteStore.load({
                    params: {
                        messungId: value,
                    }
                });

                if (!this.messwerteStore){
                    return 'unbekannt';
                }
                return this.messwerteStore.getCount();
            }
        }, {
            header: 'Anzahl Kommentare',
            flex: 1,
            dataIndex: 'id',
            renderer: function(value) {
//fixme: gibt immer 0 aus
               this.mKommentareStore.load({
                    params: {
                        messungsId: value,
                    }
                });

                if (!this.mKommentareStore){
                    return 'unbekannt';
                }

                return this.mKommentareStore.getTotalCount();
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function(){
        this.store = Ext.create('Lada.store.Messungen');
        this.statusStore = Ext.create('Lada.store.Status');
        this.messwerteStore = Ext.create('Lada.store.Messwerte');
        this.mKommentareStore = Ext.create('Lada.store.MKommentare');

        this.store.load({
            params: {
                probeId: this.recordId
            }
        });
    }
});
