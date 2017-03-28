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

    requires: [
        'Ext.ux.grid.FiltersFeature',
        'Lada.view.widget.KoordinatenArt',
        'Lada.view.widget.Kta',
        'Lada.view.widget.OrtsZusatz',
        'Lada.view.widget.OrtTyp'
    ],
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
    features: [],

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

        filters = {
            ftype: 'filters',
            // encode and local configuration options defined previously for easier reuse
            encode: false, // json encode the filter query
            local: true,   // defaults to false (remote filtering)

            // Filters are most naturally placed in the column definition, but can also be
            // added here.
            filters: [{
                type: 'boolean',
                dataIndex: 'visible'
            }]
        };
        this.features = [filters];
        var me = this;
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
            },
            handler: function(grid, rowIndex, colIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                if (rec.get('readonly') === false) {
                    me.rowEditing.startEdit(rowIndex, colIndex);
                }
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
            width: 60,
            editor: {
                xtype: 'textfield',
                maxLength: 10,
                allowBlank: false
            },
            filter: {
                type: 'string'
            },
            dataIndex: 'ortId'
        }, {
            header: i18n.getMsg('orte.ortTyp'),
            width: 40,
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('orttyp'),
                displayField: 'code',
                valueField: 'id'
            },
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    return '';
                }
                var ot = Ext.data.StoreManager.get('orttyp');
                var record = ot.getById(value);
                return record.get('code');
            },
            dataIndex: 'ortTyp'
        }, {
            header: i18n.getMsg('orte.kurztext'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield',
                maxLength: 15,
                allowBlank: false
            },
            dataIndex: 'kurztext'
        }, {
            header: i18n.getMsg('orte.langtext'),
            width: 200,
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield',
                maxLength: 100,
                allowBlank: false
            },
            dataIndex: 'langtext'
        }, {
            header: i18n.getMsg('orte.verwaltungseinheit'),
            dataIndex: 'gemId',
            width: 200,
            filter: {
                type: 'string'
            },
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
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
            width: 50,
            filter: {
                type: 'string'
            },
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
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
            header: i18n.getMsg('orte.nutsCode'),
            editor: {
                xtype: 'textfield',
                maxLength: 10
            },
            filter: {
                type: 'string'
            },
            dataIndex: 'nutsCode'
        }, {
            header: i18n.getMsg('orte.ozId'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('ortszusatz'),
                displayField: 'ozsId',
                valueField: 'ozsId'
            },
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    return '';
                }
                var oz = Ext.data.StoreManager.get('ortszusatz');
                var record = oz.getById(value);
                return record.get('ozsId');
            },
            dataIndex: 'ozId'
        }, {
            header: i18n.getMsg('orte.anlageId'),
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('ktas'),
                displayField: 'code',
                valueField: 'id'
            },
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    return '';
                }
                var store = Ext.data.StoreManager.get('ktas');
                var record = store.getById(value);
                return record.get('code');
            },
            dataIndex: 'anlageId'
        }, {
            header: i18n.getMsg('orte.mpArt'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield',
                maxLength: 10
            },
            dataIndex: 'mpArt'
        }, {
            header: i18n.getMsg('orte.zone'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield',
                maxLength: 1
            },
            dataIndex: 'zone'
        }, {
            header: i18n.getMsg('orte.sektor'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield',
                maxLength: 2
            },
            dataIndex: 'sektor'
        }, {
            header: i18n.getMsg('orte.zustaendigkeit'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield',
                maxLength: 10
            },
            dataIndex: 'zustaendigkeit'
        }, {
            header: i18n.getMsg('orte.berichtstext'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield',
                maxLength: 70
            },
            dataIndex: 'berichtstext'
        }, {
            header: i18n.getMsg('orte.unscharf'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield'
            },
            dataIndex: 'unscharf'
        }, {
            header: i18n.getMsg('orte.kdaId'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('koordinatenart'),
                displayField: 'koordinatenart',
                valueField: 'id'
            },
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    return '';
                }
                var kda = Ext.data.StoreManager.get('koordinatenart');
                var record = kda.getById(value);
                return record.get('koordinatenart');
            },
            dataIndex: 'kdaId'
        }, {
            header: i18n.getMsg('orte.koordXExtern'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield',
                maxLength: 22,
                allowBlank: false
            },
            dataIndex: 'koordXExtern'
        }, {
            header: i18n.getMsg('orte.koordYExtern'),
            filter: {
                type: 'string'
            },
            editor: {
                xtype: 'textfield',
                maxLength: 22,
                allowBlank: false
            },
            dataIndex: 'koordYExtern'
        }, {
            header: i18n.getMsg('orte.longitude'),
            filter: {
                type: 'numeric'
            },
            editor: {
                xtype: 'numberfield'
            },
            dataIndex: 'longitude'
        }, {
            header: i18n.getMsg('orte.latitude'),
            filter: {
                type: 'numeric'
            },
            editor: {
                xtype: 'numberfield'
            },
            dataIndex: 'latitude'
        }, {
            header: i18n.getMsg('orte.hoeheLand'),
            filter: {
                type: 'numeric'
            },
            editor: {
                xtype: 'numberfield'
            },
            dataIndex: 'hoeheLand'
        }, {
            header: i18n.getMsg('letzteAenderung'),
            filter: {
                type: 'date'
            },
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
            // We are not in stammdaten editor.
            if (!panel) {
                return;
            }
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
