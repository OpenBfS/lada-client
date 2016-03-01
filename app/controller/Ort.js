/**
 *
 */
Ext.define('Lada.controller.Ort', {
    extend: 'Ext.app.Controller',

    /**
     * @private
     * Initialize the controller.
     */
    init: function() {
        var me = this;
        this.control({
            'ortpanel button[action=addMap]': {
                click: me.addFeature
            },
            'ortpanel button[action=add]': {
                click: me.addRecord
            },
            'ortpanel button[action=delete]': {
                click: me.deleteItem
            },
            'ortpanel ortstammdatengrid': {
                edit: me.gridSave,
                canceledit: me.cancelEdit,
                select: me.activateButtons,
                deselect: me.deactivateButtons
            }
        });
    },

    addFeature: function(button) {
        console.log('add feature');
    },

    addRecord: function(button) {
        console.log('add record');
    },

    deleteItem: function(button) {
        console.log('delete item');
    },

    /**
     * This function is called when the grids roweditor saves
     * the record.
     * On success it refreshes the windows which contains the grid
     * On failure it displays a message
     */
    gridSave: function(editor, context) {
        var i18n = Lada.getApplication().bundle;
        context.record.save({
            success: function(record, response) {
                //Do Nothing
            },
            failure: function(record, response) {
              var json = response.request.scope.reader.jsonData;
              if (json) {
                if (json.message){
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title')
                        +' #'+json.message,
                        i18n.getMsg(json.message));
                   } else {
                         Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                            i18n.getMsg('err.msg.generic.body'));
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
     * Toggles the buttons in the toolbar
     **/
    activateButtons: function(rowModel, record) {
        var panel = rowModel.view.up('ortpanel');
        this.buttonToggle(true, panel);
    },

    /**
     * Toggles the buttons in the toolbar
     **/
    deactivateButtons: function(rowModel, record) {
        var panel = rowModel.view.up('ortpanel');
        // Only disable buttons when nothing is selected
        if (rowModel.selected.items == 0) {
            this.buttonToggle(false, panel);
        }
    },

    /**
     * Enables/Disables a set of buttons
     **/
    buttonToggle: function(enabled, panel) {
        if (!enabled &&
            panel.down('button[action=delete]')) {
            panel.down('button[action=delete]').disable();
        }
        else {
            if (panel.down('ortstammdatengrid').getPlugin('rowedit') &&
                !panel.down('ortstammdatengrid').getPlugin('rowedit').editing &&
                panel.down('button[action=delete]')) {
            //only enable buttons, when grid is not beeing edited
                panel.down('button[action=delete]').enable();
            }
            //else turn them off again!
            else if (panel.down('button[action=delete]')) {
                panel.down('button[action=delete]').disable();
            }
        }
    }
});
