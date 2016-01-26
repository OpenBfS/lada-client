/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * This is a controller for an Ortszuordnung Form
 */
Ext.define('Lada.controller.form.Ortszuordnung', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller with 4 listeners
     */
    init: function() {
        this.control({
            'ortszuordnungform button[action=save]': {
                click: this.save
            },
            'ortszuordnungform button[action=discard]': {
                click: this.discard
            },
            'ortszuordnungform': {
                dirtychange: this.dirtyForm
            },
            'ortszuordnungform combobox[name=ort]': {
                select: this.updateDetails
            }
        });
    },

     /**
      * The save function saves the content of the Ort form.
      * On success it will reload the Store,
      * on failure, it will display an Errormessage
      */
     save: function(button) {
        var formPanel = button.up('ortszuordnungform');
        var data = formPanel.getForm().getFieldValues(true);
        var i18n = Lada.getApplication().bundle;
        for (var key in data) {
            formPanel.getForm().getRecord().set(key, data[key]);
        }
        if (!formPanel.getForm().getRecord().get('letzteAenderung')) {
            formPanel.getForm().getRecord().data.letzteAenderung = new Date();
        }
        formPanel.getForm().getRecord().save({
            success: function(record, response) {
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                    formPanel.clearMessages();
                    formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                    formPanel.up('window').grid.store.reload();
                    debugger;
                }
            },
            failure: function(record, response) {
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
                var json = response.request.scope.reader.jsonData;
                if (json) {
                    if(json.errors.totalCount > 0 || json.warnings.totalCount > 0){
                        formPanel.setMessages(json.errors, json.warnings);
                    }

                    if(json.message){
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
     */
    dirtyForm: function(form, dirty) {
        if (dirty) {
            form.owner.down('button[action=save]').setDisabled(false);
            form.owner.down('button[action=discard]').setDisabled(false);
        }
        else {
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=discard]').setDisabled(true);
        }
    }
});
