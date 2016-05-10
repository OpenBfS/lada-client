/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Probenehmer Stammdaten
 */
Ext.define('Lada.view.grid.Probenehmer', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.probenehmergrid',

    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    warnings: null,
    errors: null,
    readOnly: true,
    allowDeselect: true,
    border: false,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('pn.emptyGrid');

        if (Ext.Array.contains(Lada.funktionen, 4)) {
            this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToMoveEditor: 1,
                autoCancel: false,
                errorSummary: false,
                disabled: false,
                pluginId: 'rowedit'
            });
            this.plugins = [this.rowEditing];
        }

        // TODO: Which docked Items are required?
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                id: 'tbtitle',
                text: i18n.getMsg('pn.gridTitle')
            },
            '->',
            {
                text: i18n.getMsg('pn.button.add'),
                icon: 'resources/img/list-add.png',
                action: 'add',
                disabled: true // disabled on startup, will be enabled by setStore
            }, {
                text: i18n.getMsg('pn.button.delete'),
                icon: 'resources/img/list-remove.png',
                action: 'delete',
                disabled: true // disabled on startup, will be enabled by controller if necessary
            }]
        }];
        this.columns = [{
            xtype: 'actioncolumn',
            text: 'RW',
            dataIndex: 'readonly',
            sortable: false,
            width: 30,
            getClass: function (val, meta, rec) {
                console.log(rec.get('statusEdit'));
                if (rec.get('readonly') === false) {
                        return 'edit';
                }
                return 'noedit';
            },
            handler: function(grid, rowIndex, colIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                grid.fireEvent('itemdblclick', grid, rec);
            }
        }, {
            header: i18n.getMsg('netzbetreiberId'),
            dataIndex: 'netzbetreiberId',
            renderer: function(value) {
                var r = '';
                if (!value || value === '') {
                    r = 'Error';
                }
                var store = Ext.data.StoreManager.get('netzbetreiber');
                var record = store.getById(value);
                if (record) {
                  r = record.get('netzbetreiber');
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('netzbetreiberFiltered'),
                displayField: 'netzbetreiber',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('bearbeiter'),
            dataIndex: 'bearbeiter',
            editor: {
                xtype: 'textfield',
                maxLength: 25,
                enforceMaxLength: true
            }
        }, {
            header: i18n.getMsg('prnId'),
            dataIndex: 'prnId',
            editor: {
                allowBlank: false,
                maxLength: 9,
                enforceMaxLength: true,
                xtype: 'textfield'
            }
        }, {
            header: i18n.getMsg('bemerkung'),
            dataIndex: 'bemerkung',
            editor: {
                allowBlank: false,
                xtype: 'textfield',
                maxLength: 60,
                enforceMaxLength: true
            }
        }, {
            header: i18n.getMsg('kurzBezeichnung'),
            dataIndex: 'kurzBezeichnung',
            editor: {
                allowBlank: false,
                xtype: 'textfield',
                maxLength: 10,
                enforceMaxLength: true
            }
        }, {
            header: i18n.getMsg('ort'),
            dataIndex: 'ort',
            editor: {
                xtype: 'textfield',
                maxLength: 20,
                enforceMaxLength: true
            }
        }, {
            header: i18n.getMsg('plz'),
            dataIndex: 'plz',
            editor: {
                xtype: 'textfield',
                maxLength: 5,
                enforceMaxLength: true
            }
        }, {
            header: i18n.getMsg('strasse'),
            dataIndex: 'strasse',
            editor: {
                xtype: 'textfield',
                maxLength: 30,
                enforceMaxLength: true
            }
        }, {
            header: i18n.getMsg('telefon'),
            dataIndex: 'telefon',
            editor: {
                xtype: 'textfield',
                maxLength: 20,
                enforceMaxLength: true
            }
        }, {
            header: i18n.getMsg('tp'),
            dataIndex: 'tp',
            editor: {
                xtype: 'textfield',
                maxLength: 3,
                enforceMaxLength: true
            }
        }, {
            header: i18n.getMsg('typ'),
            dataIndex: 'typ',
            editor: {
                xtype: 'textfield',
                maxLength: 1,
                enforceMaxLength: true
            }
        }, {
            header: i18n.getMsg('letzteAenderung'),
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            dataIndex: 'letzteAenderung'
        }];
        this.listeners = {
           select: {
               fn: this.activateRemoveButton,
               scope: this
            },
            deselect: {
                fn: this.deactivateRemoveButton,
                scope: this
            }
        };
        this.callParent(arguments);
    },

    /**
     * This sets the Store of this Grid
     */
    setStore: function(store) {
        var i18n = Lada.getApplication().bundle;
        if (Ext.Array.contains(Lada.funktionen, 4)) {
            this.down('button[action=add]').enable();
        }

        if (store) {
            this.removeDocked(Ext.getCmp('ptbar'), true);
            this.reconfigure(store);
            this.addDocked([{
                xtype: 'pagingtoolbar',
                id: 'ptbar',
                dock: 'bottom',
                store: store,
                displayInfo: true
            }]);
        }
    }
});

