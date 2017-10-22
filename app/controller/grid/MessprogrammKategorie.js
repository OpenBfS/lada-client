/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of MessprogrammKategorie Stammdaten
 */
Ext.define('Lada.controller.grid.MessprogrammKategorie', {
    extend: 'Ext.app.Controller',

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'messprogrammkategoriegrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit,
                select: this.select,
                deselect: this.buttonToggle,
                itemdblclick: this.edit
            },
            'messprogrammkategoriegrid toolbar button[action=add]': {
                click: this.add
            },
            'messprogrammkategoriegrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    select: function(rowModel, record) {
        this.checkEdit(rowModel, record);
        this.buttonToggle(rowModel, record);
    },

    checkEdit: function(rowModel, record) {
        if (!Ext.Array.contains(Lada.netzbetreiber,
            record.get('netzbetreiberId')) &&
            record.get('netzbetreiberId') !== '') {
            var grid = Ext.ComponentQuery.query('messprogrammkategoriegrid')[0];
            grid.rowEditing.cancelEdit();
            return;
        }
    },

    edit: function(rowModel, record) {
        var grid = Ext.ComponentQuery.query('messprogrammkategoriegrid')[0];
        if (!Ext.Array.contains(Lada.netzbetreiber,
            record.get('netzbetreiberId')) &&
            record.get('netzbetreiberId') !== '') {
            grid.rowEditing.cancelEdit();
            return;
        }
        grid.rowEditing.startEdit(record, 0);
        grid.down('button[action=delete]').disable();
    },

    /**
     * This function is called when the grids roweditor saves
     * the record.
     * On success it refreshes the windows which contains the grid
     * On failure it displays a message
     */
    gridSave: function(editor, context) {
        var i18n = Lada.getApplication().bundle;
        if (context.record.phantom) {
            context.record.set('id', null);
        }
        context.record.save({
            success: function(record, response) {
                var grid = Ext.ComponentQuery.query('messprogrammkategoriegrid')[0];
                grid.store.reload();
            },
            failure: function(record, response) {
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
                            +' #'+json.message,
                            i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
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
            context.record.set('id', null);
            this.buttonToggle();
        } else {
            this.buttonToggle(context.grid.getSelectionModel(), context.record);
        }
    },

    /**
     * This function adds a new row to add a probenehmer
     */
    add: function(button) {
        var record = Ext.create('Lada.model.MessprogrammKategorie');
        if (!record.get('letzteAenderung')) {
            record.data.letzteAenderung = new Date();
        }
        button.up('messprogrammkategoriegrid').store.insert(0, record);
        button.up('messprogrammkategoriegrid').rowEditing.startEdit(0, 1);
    },

    /**
     * A record can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(i18n.getMsg('delete'),
            i18n.getMsg('confirmation.question'),
            function(btn) {
                if (btn === 'yes') {
                    selection.erase({
                        success: function() {
                            var grid = Ext.ComponentQuery.query('messprogrammkategoriegrid')[0];
                            grid.store.reload();
                        },
                        failure: function(request, response) {
                            var i18n = Lada.getApplication().bundle;
                            if (response.error) {
                            //TODO: check content of error.status (html error code)
                                Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                    i18n.getMsg('err.msg.generic.body'));
                            } else {
                                var json = Ext.decode(
                                    response.getResponse().responseText);
                                if (json) {
                                    if (json.message) {
                                        Ext.Msg.alert(i18n.getMsg(
                                            'err.msg.delete.title')
                                    +' #'+json.message,
                                        i18n.getMsg(json.message));
                                    } else {
                                        Ext.Msg.alert(i18n.getMsg(
                                            'err.msg.delete.title'),
                                        i18n.getMsg(
                                            'err.msg.generic.body'));
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
     * Enables/Disables a set of buttons
     **/
    buttonToggle: function(rowModel, record) {
        if (!Ext.Array.contains(Lada.funktionen, 4)) {
            return;
        }
        var grid = Ext.ComponentQuery.query('messprogrammkategoriegrid')[0];
        if (!record ||
            !Ext.Array.contains(Lada.netzbetreiber,
                record.get('netzbetreiberId'))) {
            grid.down('button[action=delete]').disable();
            return;
        }
        if (record.get('readonly') ||
            rowModel.selected.items.length === 0) {
            grid.down('button[action=delete]').disable();
        } else {
            if (grid.getPlugin('rowedit').editing) {
            //only enable buttons, when grid is not being edited
                grid.down('button[action=delete]').disable();
            } else {
                grid.down('button[action=delete]').enable();
            }
        }
    }
});
