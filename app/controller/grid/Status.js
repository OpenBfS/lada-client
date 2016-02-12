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
            },
            'statusgrid button[action=add]': {
                click: this.add
            },
            'statusgrid button[action=reset]': {
                click: this.reset
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
            success: function(response) {
                var i18n = Lada.getApplication().bundle;
                var json = Ext.JSON.decode(response.responseText);

                if(json) {
                    if (!json.success) {
                        if(json.message){
                            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title')
                                +' #'+json.message,
                                i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                        i18n.getMsg('err.msg.generic.body'));
                    }
                }

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
                var i18n = Lada.getApplication().bundle;
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
                } else {
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                        i18n.getMsg('err.msg.response.body'));
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
     *  and copies the data of the previous status into the new one
     *  if possible.
     */
     add: function(button) {
        var lastrow = button.up('statusgrid').store.count()

        // retrive current status from the messung.
        var s = button.up('window').down('messungform').getRecord().get('status');
        var recentStatus = button.up('statusgrid').store.getById(s);

        button.up('statusgrid').statusWerteStore.reload();

        //If possible copy the previous record into the new one.
        //this assumes the store is ordered correctly, most recent status last.
        // Do not copy, if current userid differs from the id of the current status
        if (lastrow > 0 &&
                Ext.Array.contains(Lada.mst, recentStatus.get('erzeuger'))) {

            if (recentStatus) {
                // clone the status
                var record = recentStatus.copy()
            }

            record.set('id', null);
            if (record.get('statusWert') === 0) {
                record.set('statusWert', null);
            }

        } else {
            //create a new one
            var record = Ext.create('Lada.model.Status', {
                messungsId: button.up('statusgrid').recordId
            });
        }

        //Set the Date
        record.set('datum', new Date());

        button.up('statusgrid').store.insert(lastrow, record);
        button.up('statusgrid').getPlugin('rowedit').startEdit(lastrow, 1);
    },

    /**
     * Reset
     * This Function instructs the server to reset the current status
     * WIP / TODO
     *
     **/
    reset: function(button) {
        var me = this;
        var rstbutton = button;
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(
            i18n.getMsg('statusgrid.reset.mbox.title'),
            i18n.getMsg('statusgrid.reset.mbox.text'),
            function(btn) {
                if (btn === 'yes') {
                    me.doReset(rstbutton);
                }
            });
     },

     doReset: function(button) {
        var i18n = Lada.getApplication().bundle;

        var resetStatusValue = 8;

        var s = button.up('window').down('messungform').getRecord().get('status');
        var messId = button.up('window').down('messungform').getRecord().get('id');
        var recentStatus = button.up('statusgrid').store.getById(s);

        //Set Status to 'Resetted' (8)
        if (recentStatus) {
            var record = recentStatus.copy();
            record.set('datum', new Date());
            record.set('statusWert', resetStatusValue);
            record.set('id', null);
            record.set('text', i18n.getMsg('statusgrid.resetText'));
        }

        Ext.Ajax.request({
            url: 'lada-server/rest/status',
            jsonData: record.getData(),
            method: 'POST',
            success: function(response) {
                var i18n = Lada.getApplication().bundle;
                var json = Ext.JSON.decode(response.responseText);

                if(json) {
                    if (!json.success) {
                        if(json.message){
                            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title')
                                +' #'+json.message,
                                i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
                    }
                }

                button.up('window').initData();
                button.up('grid').initData();
            },
            failure: function(response) {
                // TODO sophisticated error handling, with understandable Texts
                var i18n = Lada.getApplication().bundle;
                var json = Ext.JSON.decode(response.responseText);
                if (json) {
                    if(json.message){
                        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title')
                            +' #'+json.message,
                            i18n.getMsg(json.message));
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                            i18n.getMsg('err.msg.generic.body'));
                    }
                } else {
                    Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                    i18n.getMsg('err.msg.generic.body'));
                }
            }
        });
     }

});
