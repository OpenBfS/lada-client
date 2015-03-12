/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Status
 */
Ext.define('Lada.view.grid.Status', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.statusgrid',

    maxHeight: 350,
    emptyText: 'Keine Statusangaben gefunden.',
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    recordId: null,

    initComponent: function() {
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        this.plugins = [this.rowEditing];

        var statusStore = Ext.create('Ext.data.Store', {
            fields: ['display', 'id'],
            data: [{
                display: 'unbekannt', id: 0
            }, {
                display: 'nicht vergeben', id: 1
            }, {
                display: 'plausibel', id: 2
            }, {
                display: 'nicht repräsentativ', id: 3
            }, {
                display: 'nicht plausibel', id: 4
            }]
        });
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Hinzufügen',
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.probeId,
                parentId: this.parentId
            }, {
                text: 'Löschen',
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'Erzeuger',
            dataIndex: 'erzeuger',
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var mstore = Ext.data.StoreManager.get('messstellen');
                return mstore.getById(value).get('messStelle');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messstellen'),
                displayField: 'messStelle',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: 'Status',
            dataIndex: 'status',
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                return statusStore.getById(value).get('display');
            },
            editor: {
                xtype: 'combobox',
                store: statusStore,
                displayField: 'display',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: 'Datum',
            dataIndex: 'sdatum',
            editor: {
                xtype: 'datefield',
                allowBlank: false,
                format: 'd.m.Y',
                maxValue: Ext.Date.format(new Date(), 'd.m.Y')
            }
        }, {
            header: 'Text',
            dataIndex: 'skommentar',
            flex: 1,
            editor: {
                allowBlank: true
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function() {
        if (this.store) {
            this.store.removeAll();
        }
        else {
            this.store = Ext.create('Lada.store.Status');
        }
        this.store.load({
            params: {
                messungsId: this.recordId
            }
        });
    }
});
