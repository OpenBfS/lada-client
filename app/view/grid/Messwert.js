/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Messwerte
 */
Ext.define('Lada.view.grid.Messwert', {
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.messwertgrid',

    requires: [
        'Lada.controller.grid.Messwert',
        'Lada.view.form.ExpNumberField',
        'Lada.view.form.FormatNumberField',
        'Lada.view.widget.Messgroesse',
        'Lada.view.widget.Messeinheit',
        'Lada.store.Umwelt',
        'Lada.store.Messwerte'
    ],

    controller: 'messwertgrid',

    minHeight: 44,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',
    umwId: null,
    defaultMehId: null,
    secMehId: null,
    readOnly: true,
    allowDeselect: true,
    messgroesseStore: null,
    bottomBar: true,

    initComponent: function() {
        this.store = Ext.create('Lada.store.Messwerte');

        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.messwerte');
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            errorSummary: false,
            autoCancel: false,
            disabled: false,
            pluginId: 'rowedit',
            listeners: {
                // Make row ineditable when readonly is set to true
                // Normally this would belong into a controller an not the view.
                // But the RowEditPlugin is not handled there.
                beforeedit: {
                    scope: this,
                    fn: function(e, o) {
                        // We are not in a messung window!
                        if (!o.grid.up('window')) {
                            return false;
                        }
                        // We are in a messung window and should check if we can
                        // edit.
                        var readonlywin = o.grid.up('window')
                            .record.get('readonly');
                        var readonlygrid = o.record.get('readonly');
                        if (
                            readonlywin === true ||
                            readonlygrid === true ||
                            this.disabled
                        ) {
                            return false;
                        }
                        if (o.record.phantom === true) {
                            e.editor.down('expnumberfield[dataIndex=measVal]')
                                .allowBlank = false;
                            e.editor.down(
                                'expnumberfield[dataIndex=detectLim]')
                                .allowBlank = false;
                            e.editor.down('formatnumberfield')
                                .allowBlank = false;
                            e.editor.down('expnumberfield[dataIndex=measVal]')
                                .setReadOnly(false);
                            e.editor.down(
                                'expnumberfield[dataIndex=detectLim]')
                                .setReadOnly(false);
                            e.editor.down('formatnumberfield')
                                .setReadOnly(false);
                            var nwgZM = e.editor.down(
                                'expnumberfield[dataIndex=detectLim]');
                            if (nwgZM.inputWrap) {
                                nwgZM.inputWrap.removeCls(
                                    'x-lada-warning-field');
                                nwgZM.inputEl.removeCls(
                                    'x-lada-warning-field');
                            }
                        } else {
                            if (o.record.get('lessThanLOD') === '<') {
                                e.editor.down(
                                    'expnumberfield[dataIndex=measVal]')
                                    .allowBlank = true;
                                e.editor.down(
                                    'expnumberfield[dataIndex=measVal]')
                                    .setReadOnly(true);
                                e.editor.down(
                                    'expnumberfield[dataIndex=detectLim]')
                                    .allowBlank = false;
                                e.editor.down(
                                    'formatnumberfield')
                                    .allowBlank = true;
                                e.editor.down(
                                    'formatnumberfield')
                                    .setReadOnly(true);
                            } else {
                                e.editor.down(
                                    'expnumberfield[dataIndex=measVal]')
                                    .allowBlank = false;
                                e.editor.down(
                                    'expnumberfield[dataIndex=detectLim]')
                                    .allowBlank = true;
                                e.editor.down(
                                    'formatnumberfield')
                                    .allowBlank = false;
                            }
                        }
                        //Preselect Messeinheit
                        if (this.defaultMehId && o.record.phantom) {
                            o.record.set('measUnitId', this.defaultMehId);
                        }
                        return true;
                    }
                }
            }
        });
        var me = this;
        this.plugins = [this.rowEditing];

        this.mehComboStore = Ext.create('Lada.store.Messeinheiten');

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: i18n.getMsg('add'),
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.probeId,
                parentId: this.parentId
            }, {
                text: i18n.getMsg('delete'),
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }, {
                buttonAlign: 'right',
                action: 'normalize',
                handler: 'normalize',
                text: i18n.getMsg('button.normalize')
            }]
        }];
        this.columns = {
            items: [{
                header: i18n.getMsg('measdId'),
                dataIndex: 'measdId',
                width: 118,
                renderer: function(value, metaData, record) {
                    this.validationResultRenderer(value, metaData, record);
                    if (!value || value === '') {
                        return '';
                    }
                    var store = Ext.data.StoreManager.get('messgroessen');
                    return store.findRecord(
                        'id', value, 0, false, false, true)
                        .get('name');
                },
                editor: {
                    xtype: 'combobox',
                    store: me.messgroesseStore,
                    displayField: 'name',
                    valueField: 'id',
                    allowBlank: false,
                    editable: true,
                    forceSelection: true,
                    autoSelect: true,
                    queryMode: 'local',
                    minChars: 0,
                    typeAhead: false,
                    triggers: {
                        clear: {
                            extraCls: 'x-form-clear-trigger'
                        }
                    },
                    triggerAction: 'all'
                }
            }, {
                header: i18n.getMsg('messwertEG'),
                width: 50,
                dataIndex: 'lessThanLOD',
                editor: {
                    xtype: 'checkbox',
                    uncheckedValue: false,
                    inputValue: '<'
                }
            }, {
                header: i18n.getMsg('measVal'),
                dataIndex: 'measVal',
                width: 80,
                editor: {
                    xtype: 'expnumberfield',
                    allowBlank: false
                },
                renderer: function(value, metaData, record) {
                    this.validationResultRenderer(value, metaData, record);
                    if (!value || value === '') {
                        return value;
                    }
                    var strValue = Lada.getApplication().toExponentialString(
                        parseFloat(value), 2).replace(
                        '.', Ext.util.Format.decimalSeparator);
                    var splitted = strValue.split('e');
                    var exponent = parseInt(splitted[1], 10);
                    return splitted[0] + 'e'
                        + ((exponent < 0) ? '-' : '+')
                        + ((Math.abs(exponent) < 10) ? '0' : '')
                        + Math.abs(exponent).toString();
                }
            }, {
                header: i18n.getMsg('detect_lim'),
                dataIndex: 'detectLim',
                width: 140,
                editor: {
                    xtype: 'expnumberfield',
                    allowBlank: false
                },
                renderer: function(value, metaData, record) {
                    this.validationResultRenderer(value, metaData, record);
                    if (!value || value === '') {
                        return value;
                    }
                    var strValue = Lada.getApplication().toExponentialString(
                        value, 2)
                        .replace('.', Ext.util.Format.decimalSeparator);
                    var splitted = strValue.split('e');
                    var exponent = parseInt(splitted[1], 10);
                    return splitted[0] + 'e'
                        + ((exponent < 0) ? '-' : '+')
                        + ((Math.abs(exponent) < 10) ? '0' : '')
                        + Math.abs(exponent).toString();
                }
            }, {
                header: i18n.getMsg('measUnitId'),
                dataIndex: 'measUnitId',
                width: 120,
                renderer: function(value, metaData, record) {
                    this.validationResultRenderer(value, metaData, record);
                    if (!value || value === '') {
                        return '';
                    }
                    var store = me.mehComboStore;
                    if (
                        store.findRecord(
                            'id', value, 0, false, false, true) === null
                    ) {
                        return Ext.data.StoreManager.get('messeinheiten')
                            .findRecord('id', value, 0, false, false, true)
                            .get('unitSymbol');
                    } else {
                        return store.findRecord('id', value, 0, false, false, true)
                            .get('unitSymbol');
                    }
                },
                editor: {
                    xtype: 'combobox',
                    store: me.mehComboStore,
                    invalidCls: 'x-lada-warning-grid-field',
                    name: 'messeinheit',
                    displayField: 'unitSymbol',
                    valueField: 'id',
                    allowBlank: false,
                    editable: true,
                    forceSelection: true,
                    autoSelect: true,
                    queryMode: 'local',
                    minChars: 0,
                    typeAhead: false,
                    triggers: {
                        clear: {
                            extraCls: 'x-form-clear-trigger'
                        }
                    },
                    triggerAction: 'all'
                }
            }, {
                header: i18n.getMsg('relMessunsicherheit'),
                dataIndex: 'error',
                xtype: 'numbercolumn',
                format: '0000.0',
                flex: 1,
                editor: {
                    xtype: 'formatnumberfield',
                    allowBlank: false,
                    maxLength: 8,
                    minValue: 0,
                    maxValue: 1000,
                    decimalPrecision: 1,
                    allowDecimals: true,
                    allowExponential: false,
                    enforceMaxLength: true,
                    hideTrigger: true
                },
                renderer: function(value, metaData, record) {
                    this.validationResultRenderer(value, metaData, record);
                    if (!value || value === '') {
                        return '';
                    }
                    return parseFloat(value).toString().replace('.', ',');
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
        this.setReadOnly(true); //Grid is always initialised as RO
        if (!me.bottomBar) {
            this.down('toolbar[dock=bottom]').hide();
        }
        this.on('edit', function(editor, context) {
            var colIdx = context.colIdx;
            var record = context.record;
            var view = context.view;
            var cell = view.getCell(record, colIdx);
            var warnings = record.get('warnings');
            var errors = record.get('errors');
            var notifications = record.get('notifications');

            //Remove warnings/errors from record as they should be resolved now
            if (warnings) {
                delete warnings[context.field];
            }
            if (errors) {
                delete errors[context.field];
            }
            if (notifications) {
                delete notifications[context.field];
            }
            //Remove error/warning class from edited cell
            view.getCell(record, colIdx).removeCls('x-lada-warning-grid-field');
            view.getCell(record, colIdx).removeCls('x-lada-error-grid-field');
            view.getCell(record, colIdx).
                removeCls('x-lada-notification-grid-field');
            cell.dom.removeAttribute('data-qtip');
        });
    },

    initData: function(parentId) {
        if (this.umwId) {
            var umwStore = Ext.create('Lada.store.Umwelt');
            this.addLoadingFailureHandler(umwStore);
            umwStore.getModel().load(this.umwId, {
                scope: this,
                success: function(rec) {
                    this.defaultMehId = rec.get('unit1');
                    this.secMehId = rec.get('unit2');
                    var params = {};
                    if (this.defaultMehId) {
                        params['measUnitId'] = this.defaultMehId;
                    }
                    if (this.secMehId) {
                        params['secMeasUnitId'] = this.secMehId;
                    }
                    //Filter messeinheiten comboboxes
                    this.mehComboStore.load({
                        params: params
                    });
                }
            });
        }
        parentId = parentId ? parentId : this.getParentRecordId();
        if (parentId) {
            this.store.load({
                params: {
                    measmId: parentId
                }
            });
        }
    },

    /**
     * Reload this grid
     */
    reload: function() {
        this.hideReloadMask();
        if (this.umwId) {
            var umwStore = Ext.create('Lada.store.Umwelt');
            this.addLoadingFailureHandler(umwStore);
            umwStore.getModel().load(this.umwId, {
                scope: this,
                success: function(rec) {
                    this.defaultMehId = rec.get('unit1');
                    this.secMehId = rec.get('unit2');
                    var params = {
                        measUnitId: this.defaultMehId
                    };
                    if (this.secMehId) {
                        params['secMeasUnitId'] = this.secMehId;
                    }
                    //Filter messeinheiten comboboxes
                    this.mehComboStore.load({
                        params: params
                    });
                }
            });
        }
        this.store.reload();
    },

    setReadOnly: function(b) {
        this.readOnly = b;
        if (b === true) {
            //Readonly
            if (this.getPlugin('rowedit')) {
                this.getPlugin('rowedit').disable();
            }
            this.down('button[action=delete]').disable();
            this.down('button[action=add]').disable();
            this.down('button[action=normalize]').disable();
        } else {
            //Writable
            if (this.getPlugin('rowedit')) {
                this.getPlugin('rowedit').enable();
            }
            //this.down('button[action=delete]').enable();
            this.down('button[action=add]').enable();
            this.down('button[action=normalize]').enable();
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
        if (! grid.readOnly) {
            grid.down('button[action=delete]').disable();
        }
    }
});
