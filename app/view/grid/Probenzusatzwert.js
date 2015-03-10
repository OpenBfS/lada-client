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
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        this.plugins = [this.rowEditing];
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
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
            width: 70
        }, {
            header: 'PZW-Größe',
            dataIndex: 'pzsId',
            flex: 1,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('probenzusaetze');
                var record = store.getById(value);
                return record.get('beschreibung');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('probenzusaetze'),
                displayField: 'beschreibung',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: 'Messwert',
            dataIndex: 'messwertPzs',
            width: 80,
            renderer: function(value, meta, record) {
                var nwg = record.get('nwgZuMesswert');
                if (value < nwg) {
                    return '<' + value;
                }
                return value;
            },
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Maßeinheit',
            dataIndex: 'pzsId',
            width: 80,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var zstore = Ext.data.StoreManager.get('probenzusaetze');
                var mstore = Ext.data.StoreManager.get('messeinheiten');
                var mehId = zstore.getById(value).get('mehId');
                var record = mstore.findRecord('id', mehId);
                return record.get('einheit');
            }
        }, {
            header: 'Nachweisgrenze',
            dataIndex: 'nwgZuMesswert',
            width: 110,
            editor: {
                allowBlank: false
            }
        }, {
            header: 'rel. Unsich.[%]',
            dataIndex: 'messfehler',
            editor: {
                allowBlank: false
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
