/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a Messung form
 */
Ext.define('Lada.controller.form.Messung', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'messungform button[action=save]': {
                click: this.save
            },
            'messungform button[action=discard]': {
                click: this.discard
            },
            'messungform button[action=audit]': {
                click: this.showAuditTrail
            },
            'messungform': {
                dirtychange: this.dirtyForm
            }
        });
    },

    /**
     * The save function saves the content of the Location form.
     * On success it will reload the Store,
     * on failure, it will display an Errormessage
     */
    save: function(button) {
        var formPanel = button.up('form');
        formPanel.setLoading(true);
        var data = formPanel.getForm().getFieldValues();
        for (var key in data) {
            formPanel.getForm().getRecord().set(key, data[key]);
        }
        formPanel.getForm().getRecord().save({
            success: function(record, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                    formPanel.clearMessages();
                    formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                    formPanel.up('window').initData();
                    formPanel.up('window').grid.store.reload();
                    var parentWin = button.up('window').parentWindow;
                    parentWin.initData();
                    if (response.action === 'create' && json.success) {
                        var oldWin = button.up('window');
                        var probe = oldWin.record;
                        oldWin.close();
                        var win = Ext.create('Lada.view.window.MessungEdit', {
                            probe: probe,
                            parentWindow: parentWin,
                            grid: oldWin.grid,
                            record: record
                        });
                        win.show();
                        win.initData();
                    }
                }
                formPanel.setLoading(false);
            },
            failure: function(record, response) {
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
                //var json = response.request.scope.reader.jsonData;
                if (response.error){
                    //TODO: check content of error.status (html error code)
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                  i18n.getMsg('err.msg.generic.body'));
                } else {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    if (json.message) {
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title')
                            + ' #' + json.message,
                            Lada.getApplication().bundle.getMsg(json.message));
                    }
                    else {
                         Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                            Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                    }
                    formPanel.clearMessages();
                    formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                    formPanel.up('window').initData();
                    formPanel.up('window').grid.store.reload();
                  }
                else {
                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                        Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                }
                formPanel.setLoading(false);
            }
            }
        });
    },

     /**
      * The discard function resets the Location form
      * to its original state.
      */
     discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
    },

     /**
      * The dirtyForm function enables or disables the save and discard
      * button which are present in the toolbar of the form.
      * The Buttons are only active if the content of the form was altered
      * (the form is dirty).
      * In Additon it calls the disableChildren() function of the window
      * embedding the form. Only when the record does not carry the readonly
      * flag, the function calls the embedding windows enableChilren() function
      */
     dirtyForm: function(form, dirty) {
        if (dirty) {
            form.owner.down('button[action=save]').setDisabled(false);
            form.owner.down('button[action=discard]').setDisabled(false);
            form.owner.up('window').disableChildren();
        }
        else {
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=discard]').setDisabled(true);
            //Only enable children if the form was not readOnly
            if (!form.getRecord().get('readonly')) {
                form.owner.up('window').enableChildren();
            }
        }
    },

    showAuditTrail: function(button) {
        Ext.create('Lada.view.window.AuditTrail', {
            autoShow: true,
            closeAction: 'destroy',
            type: 'messung',
            objectId: button.up('form').recordId
        });
    }
});
