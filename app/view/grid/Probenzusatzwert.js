/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Probenzusatzwerte
 */
Ext.define('Lada.view.grid.Probenzusatzwert', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.probenzusatzwertgrid',
    requires: [
        'Lada.view.widget.Probenzusatzwert'
    ],

    maxHeight: 350,
    emptyText: 'Keine Zusatzwerte gefunden.',
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    recordId: null,

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
            header: 'PZW-ID',
            dataIndex: 'id',
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, {
            header: 'PZW-Größe',
            dataIndex: 'pzsId',
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('probenzusaetze');
                var record = store.getById(value);
                return record.get('beschreibung');
            },
            flex: 1,
            editor: {
                xtype: 'probenzusatzwert'
            }
        }, {
            header: 'Messwert',
            dataIndex: 'id',
            renderer: function(value) {
                var record = this.store.getById(value);
                var messwert = record.get('messwertPzs');
                var nwg = record.get('nwgZuMesswert');
                if (messwert < nwg) {
                    return '<' + messwert;
                }
                return messwert;
            }
        }, {
            header: 'rel. Unsich.[%]',
            dataIndex: 'messfehler',
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Maßeinheit',
            dataIndex: 'pzsId',
            renderer: function(value) {
                var zstore = Ext.data.StoreManager.get('probenzusaetze');
                var mstore = Ext.data.StoreManager.get('messeinheiten');
                var mehId = zstore.getById(value).get('mehId');
                var record = mstore.findRecord('id', mehId);
                return record.get('einheit');
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function() {
        this.store = Ext.create('Lada.store.Zusatzwerte');
        this.store.load({
            params: {
                probeId: this.recordId
            }
        });
    }
});
