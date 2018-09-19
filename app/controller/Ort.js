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
            'dynamicgrid button[action=addMap]': {
                click: me.activateDraw
            },

            'ortpanel button[action=delete]': {
                click: me.deleteItem
            },
            'ortpanel ortstammdatengrid': {
                itemdblclick: me.editRecord,
                select: me.selectPanel
            },
            'ortszuordnungwindow ortstammdatengrid': {
                select: me.selectWindow
            }
        });
    },

    activateDraw: function(button) {
        var map = button.up('dynamicgrid').down('map');
        var record = Ext.create('Lada.model.Ort');
        map.activateDraw(record);
    },

    addRecord: function(button) {
        Ext.create('Lada.view.window.Ort',{
            record: Ext.create('Lada.model.Ort', {ortTyp: 1}),
            parentWindow: button.up('dynamicgrid'),
            setOzOnComplete: true
        }).show();
    },

    editRecord: function(grid, record) {
        if (record.get('readonly') === false) {
            Lada.model.Ort.load(record.get('id'), {
                success: function(record) {
                    Ext.create('Lada.view.window.Ort',{
                        record: record,
                        parentWindow: grid.up('panel')
                    }).show();
                }
            });
        }
    },

    deleteItem: function(button) {
        var grid = button.up('ortpanel').down('ortstammdatengrid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(i18n.getMsg('delete'),
            i18n.getMsg('confirmation.question'),
            function(btn) {
                if (btn === 'yes') {
                    selection.erase({
                        success: function() {
                            grid.store.reload();
                        },
                        failure: function(request, response) {
                            var json = response.request.scope.reader.jsonData;
                            if (json) {
                                if (json.message) {
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
    }
});
