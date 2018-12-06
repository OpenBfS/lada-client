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
    extend: 'Ext.grid.Panel',
    alias: 'widget.messwertgrid',

    requires: [
        'Lada.view.form.ExpNumberField',
        'Lada.view.widget.Messgroesse',
        'Lada.view.widget.Messeinheit'
    ],

    minHeight: 44,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 15, 5',
    recordId: null,
    umwId: null,
    defaultMehId: null,
    readOnly: true,
    allowDeselect: true,
    messgroesseStore: null,
    bottomBar: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText= i18n.getMsg('emptytext.messwerte');
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
                        var readonlywin = o.grid.up('window').record.get('readonly');
                        var readonlygrid = o.record.get('readonly');
                        if (readonlywin === true || readonlygrid === true || this.disabled) {
                            return false;
                        }
                        //Preselect Messeinheit
                        if (this.defaultMehId) {
                            o.record.set('mehId', this.defaultMehId);
                        }
                        return true;
                    }
                }
            }
        });
        var me = this;
        this.plugins = [this.rowEditing];

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
            }]
        }];
        this.columns = [{
            header: i18n.getMsg('messgroesseId'),
            dataIndex: 'messgroesseId',
            width: 118,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('messgroessen');
                return store.findRecord('id', value, 0, false, false, true).get('messgroesse');
            },
            editor: {
                xtype: 'combobox',
                store: me.messgroesseStore,
                displayField: 'messgroesse',
                valueField: 'id',
                allowBlank: true,
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
            width: 40,
            dataIndex: 'messwertNwg',
            editor: {
                xtype: 'checkbox',
                uncheckedValue: false,
                inputValue: '<'
            }
        }, {
            header: i18n.getMsg('messwert'),
            dataIndex: 'messwert',
            width: 80,
            editor: {
                xtype: 'expnumberfield'
            },
            renderer: function(value) {
                if (!value || value === '') {
                    return value;
                }
                var strValue = value.toExponential(2).toString()
                    .replace('.', Ext.util.Format.decimalSeparator);
                var splitted = strValue.split('e');
                var exponent = parseInt(splitted[1], 10);
                return splitted[0] + 'e'
                    + ((exponent < 0) ? '-' : '+')
                    + ((Math.abs(exponent) < 10) ? '0' : '')
                    + Math.abs(exponent).toString();
            }
        }, {
            header: i18n.getMsg('messwert_nwg'),
            dataIndex: 'nwgZuMesswert',
            width: 120,
            editor: {
                xtype: 'expnumberfield',
                allowBlank: false
            },
            renderer: function(value) {
                if (!value || value === '') {
                    return value;
                }
                var strValue = value.toExponential(2).toString()
                    .replace('.', Ext.util.Format.decimalSeparator);
                var splitted = strValue.split('e');
                var exponent = parseInt(splitted[1], 10);
                return splitted[0] + 'e'
                    + ((exponent < 0) ? '-' : '+')
                    + ((Math.abs(exponent) < 10) ? '0' : '')
                    + Math.abs(exponent).toString();
            }
        }, {
            header: i18n.getMsg('mehId'),
            dataIndex: 'mehId',
            flex: 1,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('messeinheiten');
                return store.findRecord('id', value, 0, false, false, true).get('einheit');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messeinheiten'),
                displayField: 'einheit',
                valueField: 'id',
                allowBlank: true,
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
            dataIndex: 'messfehler',
            xtype: 'numbercolumn',
            format: '0000.0',
            width: 150,
            editor: {
                xtype: 'numberfield',
                allowBlank: true,
                maxLength: 10,
                minValue: 0,
                decimalPrecision: 1,
                allowDecimals: true,
                allowExponential: false,
                enforceMaxLength: true,
                hideTrigger: true
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
        if (!me.bottomBar) {
            this.down('toolbar[dock=bottom]').hide();
        }
    },

    initData: function() {
        if (this.store) {
            this.store.removeAll();
        } else {
            this.store = Ext.create('Lada.store.Messwerte');
        }

        if (this.umwId) {
            var umwStore = Ext.create('Lada.store.Umwelt');
            umwStore.getModel().load(this.umwId, {
                scope: this,
                success: function(rec, op) {
                    this.defaultMehId = rec.get('mehId');
                }
            });
        }
        this.store.load({
            params: {
                messungsId: this.recordId
            }
        });
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
