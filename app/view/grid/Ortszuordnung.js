/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Ortszuordnungen
 */
Ext.define('Lada.view.grid.Ortszuordnung', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ortszuordnunggrid',

    maxHeight: 350,
    emptyText: 'Keine Orte gefunden.',
    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    recordId: null,

    isMessprogramm: false,

    warnings: null,
    errors: null,
    readOnly: true,
    allowDeselect: true,

    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;

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
            xtype: 'actioncolumn',
            text: '',
            dataIndex: 'readonly',
            sortable: false,
            width: 30,
            getClass: function(val, meta, rec) {
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
            header: 'Typ',
            dataIndex: 'ortszuordnungTyp',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('orte.ortId'),
            dataIndex: 'ortId',
            flex: 2,
            renderer: function(value, meta, zuordnung) {
                var store = Ext.data.StoreManager.get('orte');
                var record = store.getById(value);
                if (!record) {
                    record = Ext.create('Lada.model.Ort');
                    record.set('id', value);
                    store.add(record);
                    Lada.model.Ort.load(value, {
                        success: function(rec) {
                            record.beginEdit();
                            for (key in rec.getData()) {
                                record.set(key, rec.getData()[key]);
                            }
                            record.endEdit();
                            me.getView().refresh();
                        }
                    });
                }
                return record.get('ortId');
            }
        }, {
            header: i18n.getMsg('staat'),
            dataIndex: 'ortId',
            flex: 1,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('orte');
                var staaten = Ext.data.StoreManager.get('staaten');
                var ortRecord = store.getById(value);
                if (!ortRecord) {
                    return '';
                }
                var stId = ortRecord.get('staatId');
                if (stId == undefined || stId == null || stId === '') {
                    return '';
                }
                var record = staaten.getById(stId);
                return record.get('staatIso');
            }
        }, {
            header: i18n.getMsg('orte.gemId'),
            dataIndex: 'ortId',
            flex: 3,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('orte');
                var record = store.getById(value);
                if (!record || record.get('gemId') === '') {
                    return '';
                }
                return record.get('gemId');
            }
        }, {
            header: i18n.getMsg('orte.verwaltungseinheit'),
            dataIndex: 'ortId',
            flex: 4,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('orte');
                var gemeinden =
                    Ext.data.StoreManager.get('verwaltungseinheiten');
                var record = store.getById(value);
                if (!record) {
                    return '';
                }
                var gemid = record.get('gemId');
                if (gemid == undefined || gemid == null || gemid === '') {
                    return '';
                }
                var record2 = gemeinden.getById(gemid);
                return record2.get('bezeichnung');
            }
        }, {
            header: i18n.getMsg('orte.anlageId'),
            dataIndex: 'ortId',
            flex: 3,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('orte');
                var record = store.getById(value);
                if (!record) {
                    return '';
                }
                var ktaId = record.get('anlageId');
                if (ktaId == undefined || ktaId == null || ktaId === '') {
                    return '';
                }
                var ktas = Ext.data.StoreManager.get('ktas');
                var kta = ktas.getById(record.get('anlageId'));
                return kta.get('code');
            }
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
        this.initData();
        this.callParent(arguments);
    },

    initData: function() {
        var modelname;
        var me = this;
        if (this.isMessprogramm) {
            this.store = Ext.create('Lada.store.OrtszuordnungMp');
            if (this.recordId) {
                this.store.load({
                    params: {
                        messprogrammId: this.recordId
                    }});
                modelname = 'Lada.model.Messprogramm';
            } else {
                return;
            }
        } else {
            modelname = 'Lada.model.Probe';
            this.store = Ext.create('Lada.store.Ortszuordnung');
            this.store.load({
                params: {
                    probeId: this.recordId
                },
                callback: function() {
                    me.reiHandling();
                }
            });
        }
        Ext.ClassManager.get(modelname).load(this.recordId, {
            failure: function(record, action) {
                // TODO
            },
            success: function(record, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    this.warnings = json.warnings;
                    this.errors = json.errors;
                }
            },
            scope: this
        });
    },

    /**
     * Set readOnly. Legacy function because it is still referenced.
     */
    setReadOnly: function(b) {
        this.readOnly = b;
        addButton = this.down('button[action=add]');
        if (b == true) {
            addButton.disable();
            this.deactivateRemoveButton(null, null);
        } else {
            addButton.enable();
        }
    },


    /**
     * Activate the Remove Button
     */
    activateRemoveButton: function(selection, record) {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (! grid.readOnly) {
            grid.down('button[action=delete]').enable();
        }
    },
    /**
     * Activate the Remove Button
     */
    deactivateRemoveButton: function(selection, record) {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (grid.readOnly) {
            grid.down('button[action=delete]').disable();
        }
    },

    reiHandling: function(value) {
        if (!this.isMessprogramm) {
            var readonly = this.up('probenedit').record.get('readonly');
            var dbId = this.up('probenedit').record.get('datenbasisId');
            var dbStore = Ext.data.StoreManager.get('datenbasis');
            var datenbasis = null;
            if (dbStore && dbId) {
                datenbasis = dbStore.getById(dbId).get('datenbasis');
            }
            if (datenbasis && (datenbasis == 'REI-I' || datenbasis == 'REI-E')) {
                if (this.store.getCount() === 0 && !readonly) {
                    this.down('button[action=add]').enable();
                    this.down('button[action=delete]').disable();
                }
                if (this.store.getCount() > 0 && !readonly) {
                    this.down('button[action=add]').disable();
                    this.down('button[action=delete]').enable();
                    //TODO error handling/Warning)
                }
            } else {
                if (readonly) {
                    this.down('button[action=add]').disable();
                    this.down('button[action=delete]').disable();
                } else {
                    this.down('button[action=add]').enable();
                    this.down('button[action=delete]').enable();
                }
            }
        }
    }
});
