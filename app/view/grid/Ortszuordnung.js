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
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.ortszuordnunggrid',
    requires: [
        'Lada.store.Ortszuordnung',
        'Lada.store.OrtszuordnungMp',
        'Lada.store.Orte'
    ],

    maxHeight: 350,
    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    isMessprogramm: false,

    warnings: null,
    errors: null,
    readOnly: true,
    allowDeselect: true,

    ignoreNextDblClick: false,

    lastClickTime: 0,
    ortstore: null,

    initComponent: function() {
        this.store = this.isMessprogramm
            ? Ext.create('Lada.store.OrtszuordnungMp')
            : Ext.create('Lada.store.Ortszuordnung');

        var ortstore = Ext.data.StoreManager.get('orte');
        if (!ortstore) {
            Ext.create('Lada.store.Orte', {
                storeId: 'orte',
                defaultPageSize: 0
            });
        }
        this.ortstore = Ext.data.StoreManager.get('orte');

        var ozsstore = Ext.data.StoreManager.get('ortszusatz');
        if (!ozsstore) {
            Ext.create('Lada.store.OrtsZusatz', {
                storeId: 'ortszusatz'});
        }
        this.ozsstore = Ext.data.StoreManager.get('ortszusatz');

        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.Ortszuordnung');
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: i18n.getMsg('add'),
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.probeId
            }, {
                text: i18n.getMsg('delete'),
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = {
            items: [{
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
                handler: function(grid, rowIndex, colIndex, item, event) {
                    var eventInst = event.browserEvent;
                    var rec = grid.getStore().getAt(rowIndex);
                    //Check if event is a pointer event
                    if (eventInst instanceof PointerEvent) {
                    //We are using IE11
                        var lastTimeStamp = me.lastClickTime;
                        me.lastClickTime = eventInst.timeStamp;
                        if (
                            (eventInst.timeStamp - lastTimeStamp) >
                            Lada.$application.dblClickTimeout
                        ) {
                            grid.fireEvent('itemdblclick', grid, rec);
                        } else {
                            grid.ignoreNextDblClick = true;
                        }
                    } else if (eventInst instanceof MouseEvent) {
                    //We are in chrome/firefox etc.
                    //Check if its not the second click of a doubleclick
                        if (event.browserEvent.detail === 1) {
                            grid.fireEvent('itemdblclick', grid, rec);
                        } else if (event.browserEvent.detail) {
                        // else tell the grid to ignore the next doubleclick
                        // as the edit window should already be open
                            grid.ignoreNextDblClick = true;
                        }
                    }
                }
            }, {
                header: i18n.getMsg('typeRegulation'),
                dataIndex: 'typeRegulation',
                width: 30,
                editor: {
                    allowBlank: false
                }
            }, {
                header: i18n.getMsg('orte.ortId'),
                dataIndex: 'siteId',
                flex: 3,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    var store = me.ortstore;
                    var record = store.getById(value);
                    if (!record) {
                        record = Ext.create('Lada.model.Site');
                        record.set('id', value);
                        store.add(record);
                        Lada.model.Site.load(value, {
                            success: function(rec) {
                                record.beginEdit();
                                for (var key in rec.getData()) {
                                    record.set(key, rec.getData()[key]);
                                }
                                record.endEdit();
                                if (me.isVisible() === true) {
                                    me.getView().refresh();
                                }
                            }
                        });
                    }
                    return Ext.htmlEncode(record.get('extId'));
                }
            }, {
                header: i18n.getMsg('ctry'),
                dataIndex: 'siteId',
                width: 45,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    var store = me.ortstore;
                    var staaten = Ext.data.StoreManager.get('staaten');
                    var ortRecord = store.getById(value);
                    if (!ortRecord) {
                        return '';
                    }
                    var stId = ortRecord.get('stateId');
                    if (stId === undefined || stId === null || stId === '') {
                        return '';
                    }
                    var record = staaten.getById(stId);
                    if (!record.get('iso3166')) {
                        return record.get('id');
                    }
                    return Ext.htmlEncode(record.get('iso3166'));
                }
            }, {
                header: i18n.getMsg('orte.gemId'),
                dataIndex: 'siteId',
                width: 80,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    var store = me.ortstore;
                    var record = store.getById(value);
                    if (!record || record.get('adminUnitId') === '') {
                        return '';
                    }
                    return Ext.htmlEncode(record.get('adminUnitId'));
                }
            }, {
                header: i18n.getMsg('orte.verwaltungseinheit'),
                dataIndex: 'siteId',
                flex: 3,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    var store = me.ortstore;
                    var gemeinden =
                    Ext.data.StoreManager.get('verwaltungseinheiten');
                    var record = store.getById(value);
                    if (!record) {
                        return '';
                    }
                    var gemid = record.get('adminUnitId');
                    if (gemid === undefined || gemid === null || gemid === '') {
                        return '';
                    }
                    var record2 = gemeinden.getById(gemid);
                    return Ext.htmlEncode(record2.get('name'));
                }
            }, {
                header: i18n.getMsg('orte.ozId'),
                dataIndex: 'poiId',
                width: 80,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    var ozs = me.ozsstore;
                    var record = ozs.getById(value);
                    if (!record) {
                        return '';
                    }
                    var ozid = record.get('id');
                    if (
                        ozid === undefined ||
                    ozid === null ||
                    ozid === ''
                    ) {
                        return '';
                    }
                    var record2 = ozs.getById(ozid);
                    var result = Ext.htmlEncode(value) + '<br>';
                    return result + Ext.htmlEncode(record2.get('name'));
                }
            }, {
                header: i18n.getMsg('orte.anlageId'),
                dataIndex: 'siteId',
                width: 60,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    var store = me.ortstore;
                    var record = store.getById(value);
                    if (!record) {
                        return '';
                    }
                    var ktaGruppeId = record.get('nuclFacilGrId');
                    if (
                        ktaGruppeId === undefined ||
                    ktaGruppeId === null ||
                    ktaGruppeId === ''
                    ) {
                        return '';
                    }
                    var ktaGruppen = Ext.data.StoreManager.get('ktaGruppe');
                    var ktaGruppe = ktaGruppen.getById(
                        record.get('nuclFacilGrId'));
                    return Ext.htmlEncode(ktaGruppe.get('name'));
                }
            }, {
                header: i18n.getMsg('orte.langtext'),
                dataIndex: 'siteId',
                flex: 4,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    var store = me.ortstore;
                    var record = store.getById(value);
                    if (!record) {
                        return '';
                    }
                    var langtext = record.get('longText');
                    if (
                        langtext === '' ||
                    langtext === undefined ||
                    langtext === null
                    ) {
                        return '';
                    }
                    return '<div style="white-space: normal !important;">' +
                                           Ext.htmlEncode(langtext) + '</div>';
                }
            }],
            defaults: {
                renderer: this.validationResultRenderer
            }
        };
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

    initData: function() {
        var parentId = this.getParentRecordId();
        if (parentId) {
            var paramKey = this.isMessprogramm ? 'mpgId' : 'sampleId';
            var me = this;
            this.store.load({
                params: {[paramKey]: parentId},
                scope: this,
                callback: me.reiHandling
            });
        }
    },

    /**
     * Reload the grid
     */
    reload: function() {
        this.hideReloadMask();
        this.store.reload();
    },

    /**
     * Set readOnly. Legacy function because it is still referenced.
     */
    setReadOnly: function(b) {
        this.readOnly = b;
        var addButton = this.down('button[action=add]');
        if (b === true) {
            addButton.disable();
            this.deactivateRemoveButton(null, null);
        } else {
            addButton.enable();
        }
    },


    /**
     * Activate the Remove Button
     */
    activateRemoveButton: function() {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (! grid.readOnly) {
            grid.down('button[action=delete]').enable();
        }
    },
    /**
     * Activate the Remove Button
     */
    deactivateRemoveButton: function() {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (grid.readOnly) {
            grid.down('button[action=delete]').disable();
        }
    },

    reiHandling: function() {
        if (!this.isMessprogramm) {
            if (!this.up('probenedit')) {
                Ext.log({msg: 'Can not find parent window', level: 'warn'});
                return;
            }
            if (!this.up('probenedit').record) {
                Ext.log({msg: 'Can not find parent record', level: 'warn'});
                return;
            }
            var readonly = this.up('probenedit').record.get('readonly');
            var dbId = this.up('probenedit').record.get('regulationId');
            var dbStore = Ext.data.StoreManager.get('datenbasis');
            var datenbasis = null;
            if (dbStore && dbId) {
                datenbasis = dbStore.getById(dbId).get('datenbasis');
            }
            if (
                datenbasis &&
                (datenbasis === 'REI-I' || datenbasis === 'REI-E')
            ) {
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
