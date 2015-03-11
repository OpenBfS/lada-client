/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Messwerte
 */
Ext.define('Lada.view.grid.Messwert', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.messwertgrid',

    requires: [
        'Lada.view.widget.Messgroesse',
        'Lada.view.widget.Messeinheit'
    ],

    maxHeight: 350,
    emptyText: 'Keine Messwerte gefunden.',
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
                probeId: this.probeId,
                parentId: this.parentId
            }, {
                text: 'Löschen',
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'Messgröße',
            dataIndex: 'messgroesseId',
            width: 80,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('messgroessen');
                return store.findRecord('id', value).get('messgroesse');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messgroessen'),
                displayField: 'messgroesse',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: 'Messwert',
            dataIndex: 'messwert',
            width: 80,
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, {
            header: 'Messeinheit',
            dataIndex: 'mehId',
            width: 90,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('messeinheiten');
                return store.findRecord('id', value).get('einheit');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messeinheiten'),
                displayField: 'einheit',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: '&lt;NWG',
            width: 60,
            dataIndex: 'messwertNwg'
        }, {
            header: 'Nachweisgrenze',
            width: 110,
            dataIndex: 'nwgZuMesswert'
        }, {
            header: 'Messfehler',
            dataIndex: 'messfehler',
            width: 80,
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, {
            header: 'Grenzwertüberschreitung',
            dataIndex: 'grenzwertueberschreitung',
            flex: 1,
            renderer: function(value) {
                if (value === true) {
                    return 'Ja';
                }
                return 'Nein';
            },
            editor: {
                xtype: 'checkbox'
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
            this.store = Ext.create('Lada.store.Messwerte');
        }
        this.store.load({
            params: {
                messungsId: this.recordId
            }
        });
    }
});
