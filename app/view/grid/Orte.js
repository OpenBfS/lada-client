/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Orte Stammdaten
 */
Ext.define('Lada.view.grid.Orte', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ortstammdatengrid',

    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    recordId: null,

    warnings: null,
    errors: null,
    readOnly: true,
    allowDeselect: true,
    editableGrid: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('orte.emptyGrid');

        if (this.editableGrid) {
            this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToMoveEditor: 1,
                autoCancel: false,
                disabled: false,
                pluginId: 'rowedit'
            });
            this.plugins = [this.rowEditing];
        }

        this.columns = [{
            xtype: 'actioncolumn',
            text: 'RW',
            dataIndex: 'readonly',
            sortable: false,
            width: 30,
            getClass: function (val, meta, rec) {
                if (rec.get('readonly') === false) {
                        return 'edit';
                }
                return 'noedit';
            }
        }, {
            header: i18n.getMsg('netzbetreiberId'),
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
            },
            dataIndex: 'netzbetreiberId'
        }, {
            header: i18n.getMsg('orte.ortId'),
            editor: {
                xtype: 'textfield',
                maxLength: 10,
                allowBlank: false
            },
            dataIndex: 'ortId'
        }, {
            header: i18n.getMsg('orte.nutsCode'),
            editor: {
                xtype: 'textfield',
                maxLength: 10
            },
            dataIndex: 'nutsCode'
        }, {
            header: i18n.getMsg('orte.anlageId'),
            editor: {
                xtype: 'numberfield'
            },
            dataIndex: 'anlageId'
        }, {
            header: i18n.getMsg('orte.verwaltungseinheit'),
            dataIndex: 'gemId',
            width: 120,
            renderer: function(value) {
                if (!value) {
                    return '';
                }
                var store = Ext.data.StoreManager.get('verwaltungseinheiten');
                var record = store.getById(value);
                return record.get('bezeichnung');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('verwaltungseinheiten'),
                displayField: 'bezeichnung',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('orte.staatId'),
            dataIndex: 'staatId',
            width: 70,
            renderer: function(value) {
                if (value === undefined || value === '') {
                    return '';
                }
                var staaten = Ext.data.StoreManager.get('staaten');
                var record = staaten.getById(value);
                return record.get('staatIso');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('staaten'),
                displayField: 'staatIso',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('orte.kdaId'),
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            },
            dataIndex: 'kdaId'
        }, {
            header: i18n.getMsg('orte.ozId'),
            dataIndex: 'ozId'
        }, {
            header: i18n.getMsg('orte.ortTyp'),
            dataIndex: 'ortTyp'
        }, {
            header: i18n.getMsg('orte.mpArt'),
            editor: {
                xtype: 'textfield',
                maxLength: 10
            },
            dataIndex: 'mpArt'
        }, {
            header: i18n.getMsg('orte.zone'),
            editor: {
                xtype: 'textfield',
                maxLength: 1
            },
            dataIndex: 'zone'
        }, {
            header: i18n.getMsg('orte.sektor'),
            editor: {
                xtype: 'textfield',
                maxLength: 2
            },
            dataIndex: 'sektor'
        }, {
            header: i18n.getMsg('orte.zustaendigkeit'),
            editor: {
                xtype: 'textfield',
                maxLength: 10
            },
            dataIndex: 'zustaendigkeit'
        }, {
            header: i18n.getMsg('orte.berichtstext'),
            editor: {
                xtype: 'textfield',
                maxLength: 70
            },
            dataIndex: 'berichtstext'
        }, {
            header: i18n.getMsg('orte.kurztext'),
            editor: {
                xtype: 'textfield',
                maxLength: 15,
                allowBlank: false
            },
            dataIndex: 'kurztext'
        }, {
            header: i18n.getMsg('orte.langtext'),
            editor: {
                xtype: 'textfield',
                maxLength: 100,
                allowBlank: false
            },
            dataIndex: 'langtext'
        }, {
            header: i18n.getMsg('orte.unscharf'),
            editor: {
                xtype: 'textfield'
            },
            dataIndex: 'unscharf'
        }, {
            header: i18n.getMsg('orte.hoeheLand'),
            editor: {
                xtype: 'numberfield'
            },
            dataIndex: 'hoeheLand'
        }, {
            header: i18n.getMsg('orte.koordXExtern'),
            editor: {
                xtype: 'textfield',
                maxLength: 22,
                allowBlank: false
            },
            dataIndex: 'koordXExtern'
        }, {
            header: i18n.getMsg('orte.koordYExtern'),
            editor: {
                xtype: 'textfield',
                maxLength: 22,
                allowBlank: false
            },
            dataIndex: 'koordYExtern'
        }, {
            header: i18n.getMsg('orte.longitude'),
            editor: {
                xtype: 'numberfield'
            },
            dataIndex: 'longitude'
        }, {
            header: i18n.getMsg('orte.latitude'),
            editor: {
                xtype: 'numberfield'
            },
            dataIndex: 'latitude'
        }, {
            header: i18n.getMsg('letzteAenderung'),
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            dataIndex: 'letzteAenderung'
        }];
        this.callParent(arguments);
    },

    /**
     * This sets the Store of this Grid
     */
    setStore: function(store){
        var i18n = Lada.getApplication().bundle;

        if (store) {
            this.reconfigure(store);

            var ptbar = this.down('pagingtoolbar');
            if (ptbar) {
                this.removeDocked(ptbar);
            }

            if (store.pageSize > 0) {
                this.addDocked([{
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    store: store,
                    displayInfo: true
                }]);
            }
        }

        if (Ext.Array.contains(Lada.funktionen, 4)) {
            var panel = this.up('ortpanel');
            panel.down('button[action=add]').enable();
            panel.down('button[action=addMap]').enable();
        }
    },

    selectOrt: function(map, feature) {
        var id = feature[0].data.id;
        var record = this.store.getById(id);
        this.getSelectionModel().select(record);
        var win = this.up('ortszuordnungwindow');
        if (win){
            win.down('ortszuordnungform').setOrt(null, record);
        }
    }
});
