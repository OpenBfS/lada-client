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
        console.log(context);
        context.record.save({
            success: function() {
                context.grid.initData();
                context.grid.up('window').initData();
            },
            failure: function(request, response) {
                var json = response.request.scope.reader.jsonData;
                if (json) {
                    if (json.message){
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title')
                            +' #'+json.message,
                            Lada.getApplication().bundle.getMsg(json.message));
                    } else {
                         Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                            Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                    }
                } else {
                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                        Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                }
            }
        });
    },

    /**
     * When the edit was canceled,
     * the empty row might have been created by the roweditor is removed
     */
     cancelEdit: function(editor, context) {
        if (!context.record.get('id') ||
            context.record.get('id') === '') {
            editor.getCmp().store.remove(context.record);
        }
    },

    /**
     * This function adds a new row
     */
    add: function(button) {
        var record = Ext.create('Lada.model.MmtMessprogramm');
        record.set('messprogrammId', button.up('messmethodengrid').recordId);
        button.up('messmethodengrid').store.insert(0, record);
        button.up('messmethodengrid').rowEditing.startEdit(0, 0);
    },

    /**
     * A row can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        //TODO i18n
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.destroy({
                    success: function() {
                        button.up('window').initData();
                    },
                    failure: function(request, response) {
                        var json = response.request.scope.reader.jsonData;
                        if (json) {
                            if (json.message){
                                Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.delete.title')
                                    +' #'+json.message,
                                    Lada.getApplication().bundle.getMsg(json.message));
                            } else {
                                Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.delete.title'),
                                    Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                            }
                        } else {
                            Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.delete.title'),
                                Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                        }
                    }
                });
            }
        });
    }
});
