/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a Controller for a Messwert Grid
 */
Ext.define('Lada.controller.grid.Messwert', {
    extend: 'Lada.controller.grid.BaseGridController',
    alias: 'controller.messwertgrid',

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'messwertgrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit
            },
            'messwertgrid button[action=add]': {
                click: this.add
            },
            'messwertgrid button[action=delete]': {
                click: this.remove
            },
            'messwertgrid checkbox': {
                change: this.handleItem
            },
            'messwertgrid expnumberfield[dataIndex=measVal]': {
                change: this.changeValue
            },
            'messwertgrid combobox[name=messeinheit]': {
                change: this.handleMehChanged
            }
        });
    },

    handleItem: function(editor, context) {
        var e = editor.up();
        if (context === true) {
            e.down('expnumberfield[dataIndex=measVal]').setValue(null);
            e.down('expnumberfield[dataIndex=measVal]').allowBlank = true;
            e.down('expnumberfield[dataIndex=measVal]').setReadOnly(true);
            e.down('formatnumberfield').setValue(null);
            e.down('formatnumberfield').allowBlank = true;
            e.down('formatnumberfield').setReadOnly(true);
            e.down('expnumberfield[dataIndex=detectLim]')
                .allowBlank = false;
            e.down('expnumberfield[dataIndex=detectLim]').setReadOnly(
                false);
            e.form.isValid();
        } else {
            e.down('expnumberfield[dataIndex=measVal]').allowBlank = false;
            e.down('expnumberfield[dataIndex=measVal]').setReadOnly(false);
            e.down('expnumberfield[dataIndex=detectLim]').allowBlank = true;
            e.down('expnumberfield[dataIndex=detectLim]').setReadOnly(
                false);
            e.down('formatnumberfield').allowBlank = false;
            e.down('formatnumberfield').setReadOnly(false);
            e.down('formatnumberfield').validateValue(
                e.down('formatnumberfield').getValue());
            e.down('expnumberfield[dataIndex=measVal]').validateValue(
                e.down('expnumberfield[dataIndex=measVal]').getValue());
            e.form.isValid();
        }
    },

    changeValue: function(editor) {
        var e = editor.up().down('expnumberfield[dataIndex=detectLim]');
        e.allowBlank = true;
        e.setReadOnly(false);
        e.validateValue(e.getValue());
        e.inputWrap.addCls('x-lada-warning-field');
        e.inputEl.addCls('x-lada-warning-field');
    },

    /**
     * This function is called when the grids roweditor saves
     * the record.
     * On success it refreshes the windows which contains the grid
     * On failure it displays a message
     */
    gridSave: function(editor, context) {
        if (context.record.phantom) {
            context.record.set('id', null);
        }
        context.record.save({
            scope: this,
            success: function() {
                if (Ext.data.StoreManager.get('messeinheiten')) {
                    Ext.data.StoreManager.get('messeinheiten').clearFilter();
                    Ext.data.StoreManager.get('messeinheiten').reload();
                }
                if (Ext.data.StoreManager.get('messgroessen')) {
                    Ext.data.StoreManager.get('messgroessen').clearFilter();
                    Ext.data.StoreManager.get('messgroessen').reload();
                }
                // If you don't do the resets above, the grid will only contain
                // one row in cases in when autocompletion was used!
                context.grid.getSelectionModel().clearSelections();
                context.grid.up('window').initData();
            },
            failure: function(record, response) {
                this.handleSaveFailure(record, response, context.record);
            }
        });
    },

    /**
     * When the edit was canceled,
     * the empty row might have been created by the roweditor is removed
     */
    cancelEdit: function(editor, context) {
        if (context.record.phantom) {
            editor.getCmp().store.remove(context.record);
        }
    },

    /**
     * This function adds a new row to add a Messwert
     */
    add: function(button) {
        var record = Ext.create('Lada.model.MeasVal', {
            measmId: button.up('messwertgrid').getParentRecordId()
        });
        record.set('id', null);
        button.up('messwertgrid').store.insert(0, record);
        button.up('messwertgrid').rowEditing.startEdit(0, 1);
    },

    /**
     * A Messwert-row can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(
            i18n.getMsg('delete.messwert'),
            i18n.getMsg('confirmation.question'),
            function(btn) {
                if (btn === 'yes') {
                    selection.erase({
                        success: function() {
                            button.up('window').initData();
                            grid.initData();
                        },
                        failure: function(request, response) {
                            if (response.error) {
                                Ext.Msg.alert(
                                    i18n.getMsg('err.msg.delete.title'),
                                    i18n.getMsg('err.msg.generic.body'));
                            } else {
                                var json = Ext.decode(
                                    response.getResponse().responseText);
                                if (json) {
                                    if (json.message) {
                                        Ext.Msg.alert(
                                            i18n.getMsg(
                                                'err.msg.delete.title')
                                                + ' #'
                                                + json.message,
                                            i18n.getMsg(json.message));
                                    } else {
                                        Ext.Msg.alert(i18n.getMsg(
                                            'err.msg.delete.title'),
                                        i18n.getMsg('err.msg.generic.body'));
                                    }
                                } else {
                                    Ext.Msg.alert(i18n.getMsg(
                                        'err.msg.delete.title'),
                                    i18n.getMsg('err.msg.response.body'));
                                }
                            }
                        }
                    });
                }
            });
        grid.down('button[action=delete]').disable();
    },

    /**
     * Handle changed values of messeinheit comboboxes.
     * Checks if the new value is the secondary unit of the corresponding
     * umweltbereich and adds a warning to the combobox.
     * @param {Ext.form.field.Combobox} cbox Combobox that triggered the event
     * @param {Number} newValue New mehId value
     */
    handleMehChanged: function(cbox, newValue) {
        var i18n = Lada.getApplication().bundle;
        var meh = cbox.getStore().getById(newValue);
        //If secondary unit is selected
        if (meh.get('primary') === false) {
            cbox.bodyEl.addCls('x-lada-warning-grid-field');
            Ext.tip.QuickTipManager.register({
                text: i18n.getMsg('636'),
                target: cbox.getId()
            });
            //attributes.setNamedItem('data-qtip', i18n.getMsg('636'));
        } else {
            cbox.bodyEl.removeCls('x-lada-warning-grid-field');
            Ext.tip.QuickTipManager.unregister(cbox.getId());
            //attributes.removeNamedItem('data-qtip');
        }
    },

    normalize: function(button) {
        Ext.Ajax.request({
            url: 'lada-server/rest/measval/normalize',
            params: {
                measmId: button.up('messungedit').record.get('id')
            },
            method: 'PUT',
            scope: this,
            jsonData: {},
            success: function(response) {
                var json = Ext.decode(response.responseText);
                if (json.success === true) {
                    button.up('messungedit').down('messwertgrid')
                        .store.reload();
                } else {
                    var i18n = Lada.getApplication().bundle;
                    Ext.Msg.alert('', i18n.getMsg('err.normalize'));
                }
            },
            failure: function(response) {
                this.handleRequestFailure(response, 'err.normalize');
            }
        });
    }
});
