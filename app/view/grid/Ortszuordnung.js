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
            getClass: function (val, meta, rec) {
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
                if (!ortRecord || ortRecord.get('staatId') === '') {
                    return '';
                }
                var record = staaten.getById(ortRecord.get('staatId'));
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
                if (!record || record.get('gemId') === '') {
                    return '';
                }
                var gemid = record.get('gemId');
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
                if (!record || record.get('anlageId') === '') {
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
        this.setReadOnly(true); //Grid is always initialised as RO
    },

    initData: function() {
        var modelname;
        if (this.isMessprogramm) {
            this.store = Ext.create('Lada.store.OrtszuordnungMp');
            this.store.load({
                params: {
                    messprogrammId: this.recordId
                }});
            modelname = 'Lada.model.Messprogramm';
        } else {
            modelname = 'Lada.model.Probe';
            this.store = Ext.create('Lada.store.Ortszuordnung');
            this.store.load({
                params: {
                    probeId: this.recordId
                }});
        }
        Ext.ClassManager.get(modelname).load(this.recordId, {
            failure: function(record, action) {
                // TODO
            },
            success: function(record, response) {
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    this.warnings = json.warnings;
                    this.errors = json.errors;
                }
            },
            scope: this
        });
    },

    setReadOnly: function(b) {
        this.readOnly = b;
        if (b) {
            //Readonly
            if (this.getPlugin('rowedit')) {
                this.getPlugin('rowedit').disable();
            }
            this.down('button[action=delete]').disable();
            this.down('button[action=add]').disable();
        }
        else {
            //Writable
            if (this.getPlugin('rowedit')) {
                this.getPlugin('rowedit').enable();
            }
            //this.down('button[action=delete]').enable();
            this.down('button[action=add]').enable();
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
        if (! grid.readOnly) {
            grid.down('button[action=delete]').disable();
        }
    }
});
