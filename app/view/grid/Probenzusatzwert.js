/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Probenzusatzwerte
 */
Ext.define('Lada.view.grid.Probenzusatzwert', {
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.probenzusatzwertgrid',
    controller: 'probenzusatzwertgrid',
    requires: [
        'Lada.view.form.ExpNumberField',
        'Lada.view.form.FormatNumberField',
        'Lada.store.Zusatzwerte',
        'Lada.controller.grid.Probenzusatzwert',
        'Lada.view.widget.Probenzusatzwert'
    ],

    maxHeight: 350,
    minHeight: 130,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    warnings: null,
    errors: null,

    readOnly: true,
    allowDeselect: true,
    pzStore: null,

    initComponent: function() {
        this.store = Ext.create('Lada.store.Zusatzwerte');

        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.zusatzwerte');
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            disabled: false,
            errorSummary: false,
            pluginId: 'rowedit',
            listeners: {
                // Make row ineditable when readonly is set to true
                // Normally this would belong into a controller an not the view.
                // But the RowEditPlugin is not handled there.
                beforeedit: function(e, o) {
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
                    return true;
                }
            }
        });
        this.plugins = [this.rowEditing];
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
                header: i18n.getMsg('pzs_id'),
                dataIndex: 'sampleSpecifId',
                flex: 1
            }, {
                header: i18n.getMsg('pzw'),
                dataIndex: 'sampleSpecifId',
                flex: 3,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    if (!value || value === '') {
                        return '';
                    }
                    var store = Ext.data.StoreManager.get('probenzusaetze');
                    var record = store.getById(value);
                    return record.get('name');
                },
                editor: {
                    xtype: 'combobox',
                    store: this.pzStore,
                    displayField: 'name',
                    name: 'name',
                    valueField: 'id',
                    allowBlank: false,
                    editable: true,
                    queryMode: 'local',
                    minChars: 0,
                    disableKeyFilter: false,
                    matchFieldWidth: false
                }
            }, {
                header: i18n.getMsg('pzwKleinerALs'),
                width: 50,
                dataIndex: 'smallerThan',
                editor: {
                    xtype: 'checkbox',
                    uncheckedValue: false,
                    inputValue: '<'
                }
            }, {
                header: i18n.getMsg('measVal'),
                dataIndex: 'measVal',
                flex: 1,
                editor: {
                    xtype: 'expnumberfield'
                },
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
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
                dataIndex: 'sampleSpecifId',
                flex: 1,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    if (!value || value === '') {
                        return '';
                    }
                    var zStore = Ext.data.StoreManager.get('probenzusaetze');
                    var mstore = Ext.data.StoreManager.get('messeinheiten');
                    var mehId = zStore.getById(value).get('unitId');
                    var record = mstore.findRecord(
                        'id', mehId, 0, false, false, true);
                    if (!record) {
                        return '';
                    }
                    return record.get('unitSymbol');
                }
            }, {
                header: i18n.getMsg('relmessfehler'),
                dataIndex: 'error',
                xtype: 'numbercolumn',
                format: '0000.0',
                flex: 1,
                editor: {
                    xtype: 'formatnumberfield',
                    allowBlank: true,
                    maxLength: 8,
                    minValue: 0,
                    maxValue: 1000,
                    decimalPrecision: 1,
                    allowDecimals: true,
                    allowExponential: false,
                    enforceMaxLength: true,
                    hideTrigger: true
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
    },

    initData: function() {
        var parentId = this.getParentRecordId();
        if (parentId) {
            this.store.load({
                params: {
                    sampleId: parentId
                }
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

    setReadOnly: function(b) {
        this.readOnly = b;
        if (b) {
            //Readonly
            if (this.getPlugin('rowedit')) {
                this.getPlugin('rowedit').disable();
            }
            this.down('button[action=delete]').disable();
            this.down('button[action=add]').disable();
        } else {
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
