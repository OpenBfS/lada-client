/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Messmethode
 */
Ext.define('Lada.controller.grid.Messmethode', {
    extend: 'Ext.app.Controller',
    record: null,

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'messmethodengrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit
            },
            'messmethodengrid button[action=add]': {
                click: this.add
            },
            'messmethodengrid button[action=delete]': {
                click: this.remove
            }
        });
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
            success: function() {
                context.grid.up('window').initData();
                var mp_win = context.grid.up('messprogramm');
                if (mp_win) {
                    mp_win.toggleGenProben();
                }
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
        var mp_win = context.grid.up('messprogramm');
        if (mp_win) {
            mp_win.toggleGenProben();
        }
    },


    /**
     * This function adds a new row
     */
    add: function(button) {
        var grid = button.up('messmethodengrid');
        var record = Ext.create('Lada.model.MmtMessprogramm', {
            messprogrammId: grid.getParentRecordId()
        });
        grid.store.insert(0, record);
        grid.rowEditing.startEdit(0, 0);
        var mp_win = grid.up('messprogramm');
        if (mp_win) {
            mp_win.toggleGenProben();
        }

    },

    /**
     * A row can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.erase({
                    success: function() {
                        button.up('window').initData();
                    },
                    failure: function(request, response) {
                        var i18n = Lada.getApplication().bundle;
                        if (response.error) {
                            Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        } else {
                            var json = Ext.decode(
                                response.getResponse().responseText);
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
    }
});
