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
Ext.define('Lada.view.messwerte.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.messwertelist',

    store: 'Messwerte',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Messwerte gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 65,
        deferEmptyText: false
    },

    probeId: null,
    parentId: null,

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
                probeId: this.probeId,
                parentId: this.parentId
            }, {
                text: 'Löschen',
                icon: 'gfx/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: '&lt;NWG',
            dataIndex: 'messwertNwg',
            editor: {
                xtype: 'nwg',
                allowBlank: false
            }
        }, {
            header: 'Messwert',
            dataIndex: 'messwert',
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, {
            header: 'Messfehler',
            dataIndex: 'messfehler',
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, {
            header: 'Messgröße',
            dataIndex: 'messgroesseId',
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('staMessgroessen');
                return store.findRecord('id', value).get('messgroesse');
            },
            editor: {
                xtype: 'messgroesse',
                allowBlank: false
            }
        }, {
            header: 'Messeinheit',
            dataIndex: 'mehId',
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('staMesseinheiten');
                return store.findRecord('id', value).get('einheit');
            },
            editor: {
                xtype: 'messeinheit',
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
                xtype: 'checkboxfield'
            }
        }];
        this.callParent(arguments);
    }
});
