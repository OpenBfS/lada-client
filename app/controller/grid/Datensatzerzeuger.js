/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Datensatzerzeuger Stammdaten
 */
Ext.define('Lada.controller.grid.Datensatzerzeuger', {
    extend: 'Ext.app.Controller',

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'datensatzerzeugergrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit,
                select: this.activateButtons,
                deselect: this.deactivateButtons
            },
            'datensatzerzeugergrid button[action=add]': {
                click: this.add
            },
            'datensatzerzeugergrid button[action=delete]': {
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
        context.record.set('datum', new Date());
        context.record.save({
            success: function(record, response) {
                //Do Nothing
            },
            failure: function(record, response) {
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
        context.grid.getSelectionModel().deselect(context.record);
    },

    /**
     * This function adds a new row to add a Datensatzerzeuger
     */
    add: function(button) {
        var record = Ext.create('Lada.model.DatensatzErzeuger');
        button.up('datensatzerzeugergrid').store.insert(0, record);
        button.up('datensatzerzeugergrid').rowEditing.startEdit(0, 1);
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
        //TODO: i18n
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.destroy({
                    success: function() {
                        //DO NOTHING
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
     * Toggles the buttons in the toolbar
     **/
    activateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        this.buttonToggle(true, grid);
    },

    /**
     * Toggles the buttons in the toolbar
     **/
    deactivateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        // Only disable buttons when nothing is selected
        if (rowModel.selected.items == 0) {
            this.buttonToggle(false, grid);
        }
    },

    /**
     * Enables/Disables a set of buttons
     **/
    buttonToggle: function(enabled, grid) {
        if (!enabled) {
            grid.down('button[action=delete]').disable();
        }
        else {
            if (!grid.getPlugin('rowedit').editing) {
            //only enable buttons, when grid is not beeing edited
                grid.down('button[action=delete]').enable();
            }
            //else turn them off again!
            else {
                this.buttonToggle(false, grid);
            }
        }
    }
});

