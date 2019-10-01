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
        'Lada.view.form.FormatNumberField',
        'Lada.view.widget.Messgroesse',
        'Lada.view.widget.Messeinheit'
    ],

    minHeight: 44,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',
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
                        if (o.record.phantom === true) {
                            e.editor.down('expnumberfield[dataIndex=messwert]').allowBlank = false;
                            e.editor.down('expnumberfield[dataIndex=nwgZuMesswert]').allowBlank = false;
                            e.editor.down('formatnumberfield').allowBlank = false;
                            e.editor.down('expnumberfield[dataIndex=messwert]').setReadOnly(false);
                            e.editor.down('expnumberfield[dataIndex=nwgZuMesswert]').setReadOnly(false);
                            e.editor.down('formatnumberfield').setReadOnly(false);
                            if (e.editor.down('expnumberfield[dataIndex=nwgZuMesswert]').inputWrap) {
                                e.editor.down('expnumberfield[dataIndex=nwgZuMesswert]').inputWrap.removeCls('x-lada-warning-field');
                                e.editor.down('expnumberfield[dataIndex=nwgZuMesswert]').inputEl.removeCls('x-lada-warning-field');
                            }
                        } else {
                            if  (o.record.get('messwertNwg') === '<') {
                                e.editor.down('expnumberfield[dataIndex=messwert]').allowBlank = true;
                                e.editor.down('expnumberfield[dataIndex=messwert]').setReadOnly(true);
                                e.editor.down('expnumberfield[dataIndex=nwgZuMesswert]').allowBlank = false;
                                e.editor.down('formatnumberfield').allowBlank = true;
                                e.editor.down('formatnumberfield').setReadOnly(true);
                            } else {
                                e.editor.down('expnumberfield[dataIndex=messwert]').allowBlank = false;
                                e.editor.down('expnumberfield[dataIndex=nwgZuMesswert]').allowBlank = true;
                                e.editor.down('formatnumberfield').allowBlank = false;
                            }
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
                handler: this.normalize,
                text: i18n.getMsg('button.normalize')
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
                xtype: 'expnumberfield',
                allowBlank: false
            },
            renderer: function(value) {
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
            header: i18n.getMsg('messwert_nwg'),
            dataIndex: 'nwgZuMesswert',
            width: 140,
            editor: {
                xtype: 'expnumberfield',
                allowBlank: false
            },
            renderer: function(value) {
                if (!value || value === '') {
                    return value;
                }
                var strValue = Lada.getApplication().toExponentialString(value, 2)
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
            width: 120,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = me.mehComboStore;
                if (store.findRecord('id', value, 0, false, false, true) === null) {
                    return Ext.data.StoreManager.get('messeinheiten').findRecord('id', value, 0, false, false, true).get('einheit');
                } else {
                    return store.findRecord('id', value, 0, false, false, true).get('einheit');
                }
            },
            editor: {
                xtype: 'combobox',
                store: me.mehComboStore,
                displayField: 'einheit',
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
            dataIndex: 'messfehler',
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
                    //Filter messeinheiten comboboxes
                    this.mehComboStore.load({
                        params: {
                            mehId: this.defaultMehId
                        }
                    })
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

    normalize: function(button) {
        var record = button.up('messungedit').record;
        var messungId = record.get('id');
        Ext.Ajax.request({
            url: 'lada-server/rest/messwert/normalize?messungsId=' + messungId,
            method: 'PUT',
            scope: this,
            jsonData: {},
            callback: function(opts, success, response) {
                var i18n = Lada.getApplication().bundle;
                if (success && response) {
                    var json = Ext.decode(response.responseText);
                    if (json.success === true) {
                        button.up('messungedit').down('messwertgrid').store.reload();
                    } else {
                        Ext.Msg.alert('', i18n.getMsg('err.normalize'));
                    }
                } else {
                    Ext.Msg.alert('', i18n.getMsg('err.normalize'));
                }
            }
        });
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
