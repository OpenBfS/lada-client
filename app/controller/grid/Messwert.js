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
    extend: 'Ext.app.Controller',

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
            'messwertgrid expnumberfield[dataIndex=messwert]': {
                change: this.changeValue
            }
        });
    },

    handleItem: function(editor, context) {
        var e = editor.up();
        if (context === true) {
            e.down('expnumberfield[dataIndex=messwert]').setValue(null);
            e.down('expnumberfield[dataIndex=messwert]').allowBlank = true;
            e.down('expnumberfield[dataIndex=messwert]').setReadOnly(true);
            e.down('formatnumberfield').setValue(null);
            e.down('formatnumberfield').allowBlank = true;
            e.down('formatnumberfield').setReadOnly(true);
            e.down('expnumberfield[dataIndex=nwgZuMesswert]').allowBlank = false;
            e.down('expnumberfield[dataIndex=nwgZuMesswert]').setReadOnly(false);
            e.form.isValid();
        } else {
            e.down('expnumberfield[dataIndex=messwert]').allowBlank = false;
            e.down('expnumberfield[dataIndex=messwert]').setReadOnly(false);
            e.down('expnumberfield[dataIndex=nwgZuMesswert]').allowBlank = true;
            e.down('expnumberfield[dataIndex=nwgZuMesswert]').setReadOnly(false);
            e.down('formatnumberfield').allowBlank = false;
            e.down('formatnumberfield').setReadOnly(false);
            e.down('formatnumberfield').validateValue(e.down('formatnumberfield').getValue());
            e.down('expnumberfield[dataIndex=messwert]').validateValue(e.down('expnumberfield[dataIndex=messwert]').getValue());
            e.form.isValid();
        }
    },

    changeValue: function(editor, context) {
        var e = editor.up().down('expnumberfield[dataIndex=nwgZuMesswert]');
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
            success: function(request, response) {
                if (Ext.data.StoreManager.get('messeinheiten')) {
                    Ext.data.StoreManager.get('messeinheiten').clearFilter();
                    Ext.data.StoreManager.get('messeinheiten').reload();
                }
                if (Ext.data.StoreManager.get('messeinheiten')) {
                    Ext.data.StoreManager.get('messgroessen').clearFilter();
                    Ext.data.StoreManager.get('messgroessen').reload();
                }
                // If you don't do the resets above, the grid will only contain
                // one row in cases in when autocompletion was used!
                context.grid.store.reload();
                context.grid.up('window').initData();
            },
            failure: function(request, response) {
                var i18n = Lada.getApplication().bundle;
                if (response.error) {
                    //TODO: check content of error.status (html error code)
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                        i18n.getMsg('err.msg.generic.body'));
                } else {
                    var json = Ext.decode(response.getResponse().responseText);
                    if (json) {
                        if (json.message) {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title')
                            + ' #' + json.message,
                            i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                            i18n.getMsg('err.msg.response.body'));
                    }
                }
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
        var record = Ext.create('Lada.model.Messwert', {
            messungsId: button.up('messwertgrid').recordId
        });
        record.set('id', null);
        if (!record.get('letzteAenderung')) {
            record.data.letzteAenderung = new Date();
        }
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
        Ext.MessageBox.confirm('Messwert löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.erase({
                    success: function() {
                        button.up('window').initData();
                        grid.initData();
                    },
                    failure: function(request, response) {
                        var i18n = Lada.getApplication().bundle;
                        if (response.error) {
                            //TODO: check content of error.status (html error code)
                            Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        } else {
                            var json = Ext.decode(response.getResponse().responseText);
                            if (json) {
                                if (json.message) {
                                    Ext.Msg.alert(i18n.getMsg(
                                        'err.msg.delete.title')
                                    + ' #' + json.message,
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
    }
});
