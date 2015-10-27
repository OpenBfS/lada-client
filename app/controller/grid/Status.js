/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Status
 */
Ext.define('Lada.controller.grid.Status', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller with
     * 3 Listeners
     */
     init: function() {
        this.control({
            'statusgrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit,
                select: this.toggleAllowedPermissions
            },
            'statusgrid button[action=add]': {
                click: this.add
            },
            'statusgrid button[action=delete]': {
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
        context.record.set('sdatum', new Date());
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
     * This function adds a new row to add a Status
     */
     add: function(button) {
        var record = Ext.create('Lada.model.Status', {
            messungsId: button.up('statusgrid').recordId
        });
        var lastrow = button.up('statusgrid').store.count()
        button.up('statusgrid').store.insert(lastrow, record);
        button.up('statusgrid').rowEditing.startEdit(lastrow, 1);
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
        Ext.MessageBox.confirm('Messwert löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.destroy({
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
    },

    /**
     * When a row in a grid is selected,
     * this function checks if the row may be edited,
     * or if the row can be removed
     */
    toggleAllowedPermissions: function(context, record, index){

        //retrieve the readOnly parameters
        var readonlyWin = context.view.up('window').record.get('readonly');

        var readonlyRec = record.get('readonly');
        var grid = context.view.up('grid');

        //retrieve the last record of the store
        var lastRecord = context.getStore().last()
        //Check if remove is allowed
        if (lastRecord == record &&
            readonlyWin == false  &&
            readonlyRec == false) {
            grid.down('button[action=delete]').enable();
        }
        else {
            grid.down('button[action=delete]').disable();
        }


        //Check if edit is allowed
        if (lastRecord == record &&
            readonlyWin == false  &&
            readonlyRec == false) {
            grid.getPlugin('rowedit').enable()
        }
        else {
            grid.getPlugin('rowedit').disable()
        }
    }

});
