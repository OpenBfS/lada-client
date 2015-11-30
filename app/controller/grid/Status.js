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
            }
        });
    },

    /**
     * This function is called when the grids roweditor saves
     * the record.
     * On success it refreshes the windows which contains the grid
     *   it also tries to refresh the ProbeWindow and the messunggrid
     * On failure it displays a message
     */
     gridSave: function(editor, context) {
        context.record.set('sdatum', new Date());
        context.record.save({
            success: function() {
                context.grid.initData();
                var win = context.grid.up('window');
                win.initData();
                try {
                    win.parentWindow.initData();
                    win.parentWindow.down('messunggrid').store.reload();
                }
                catch(e) {
                }
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
        //Set the Date
        record.data.datum = new Date();
        var lastrow = button.up('statusgrid').store.count()
        button.up('statusgrid').store.insert(lastrow, record);
        button.up('statusgrid').rowEditing.startEdit(lastrow, 1);
    },


    /**
     * When a row in a grid is selected,
     * this function checks if the row may be edited,
     * or if the row can be removed
     */
    toggleAllowedPermissions: function(context, record, index){

        //retrieve the readOnly parameters
        var statusEdit = context.view.up('window').record.get('statusEdit');

        var grid = context.view.up('grid');

        //retrieve the last record of the store
        var lastRecord = context.getStore().last();

        //Check if edit is allowed
        if (lastRecord != record ||
            statusEdit === false) {
            grid.getPlugin('rowedit').cancelEdit();
        }
    }

});
