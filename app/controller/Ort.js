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
                click: me.activateDraw
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
                select: me.selectPanel
            },
            'ortszuordnungwindow ortstammdatengrid': {
                select: me.selectWindow
            }
        });
    },

    activateDraw: function(button) {
        var map = button.up('ortpanel').down('map');
        var record = Ext.create('Lada.model.Ort');
        map.activateDraw(record);
    },

    addRecord: function(button) {
        Ext.create('Lada.view.window.Ortserstellung',{
            record: Ext.create('Lada.model.Ort', {ortTyp: 1}),
            parentWindow: button.up('ortpanel')
        }).show();
        var grid = button.up('ortpanel').down('ortstammdatengrid');
        // if (grid.getCollapsed()) {
        //    grid.expand();
        // }
    },

    deleteItem: function(button) {
        var grid = button.up('ortpanel').down('ortstammdatengrid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(i18n.getMsg('delete'),
                                i18n.getMsg('confirmation.question'),
                                function(btn) {
            if (btn === 'yes') {
                selection.destroy({
                    success: function() {
                        //DO NOTHING
                    },
                    failure: function(request, response) {
                        var json = response.request.scope.reader.jsonData;
                        if (json) {
                            if (json.message){
                                Ext.Msg.alert(i18n.getMsg('err.msg.delete.title')
                                    +' #'+json.message,
                                    i18n.getMsg(json.message));
                            } else {
                                Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                    i18n.getMsg('err.msg.generic.body'));
                            }
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                i18n.getMsg('err.msg.response.body'));
                        }
                    }
                });
            }
        });
        grid.up('ortpanel').down('button[action=delete]').disable();
    },

    selectPanel: function(rowModel, record) {
        this.buttonToggle(rowModel, record);
    },

    selectWindow: function(rowModel, record) {
        this.buttonToggle(rowModel, record);
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
                Ext.StoreManager.get('orte').load();
                var grid = Ext.ComponentQuery.query('ortstammdatengrid')[0];
                grid.store.load({
                    callback: function() {
                        var map = Ext.ComponentQuery.query('map')[0];
                        map.addLocations(grid.store);
                        var parentPanel = grid.up('panel').ownerCt;
                        if (parentPanel){
                            if (parentPanel.ortstore) {
                                parentPanel.ortstore.load();
                            }
                            var ozf = parentPanel.down('ortszuordnungform');
                            if (ozf){
                                ozf.setOrt(null, record);
                            }
                        }
                    }
                });
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
     * Enables/Disables a set of buttons
     **/
    buttonToggle: function(rowModel, record) {
        if (!Ext.Array.contains(Lada.funktionen, 4)) {
            return;
        }
        var grid = Ext.ComponentQuery.query('ortstammdatengrid')[0];
        if (!grid.up('ortpanel')) {
            return;
        }
        if (!record ||
            !Ext.Array.contains(Lada.netzbetreiber,
            record.get('netzbetreiberId'))) {
            grid.up('ortpanel').down('button[action=delete]').disable();
            return;
        }
        if (record.get('readonly') ||
            rowModel.selected.items.length === 0) {
            grid.up('ortpanel').down('button[action=delete]').disable();
        }
        else {
            if (grid.getPlugin('rowedit').editing) {
            //only enable buttons, when grid is not beeing edited
                grid.up('ortpanel').down('button[action=delete]').disable();
            }
            else {
                grid.up('ortpanel').down('button[action=delete]').enable();
            }
        }
        /*
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
        */
    }
});
