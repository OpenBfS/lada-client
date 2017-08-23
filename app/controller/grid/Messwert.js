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
        if (context.record.phantom){
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
                var json = Ext.decode(response.getResponse().responseText);
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
          if (context.record.phantom){
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
        grid.down('button[action=delete]').disable();
    }
});
