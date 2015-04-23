/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * This is a controller for an Ort Form
 */
Ext.define('Lada.controller.form.Ort', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller with 4 listeners
     */
    init: function() {
        this.control({
            'ortform button[action=save]': {
                click: this.save
            },
            'ortform button[action=discard]': {
                click: this.discard
            },
            'ortform': {
                dirtychange: this.dirtyForm
            },
            'ortform combobox[name=ort]': {
                select: this.updateDetails
            }
        });
    },

     /**
      * The save function saves the content of the Location form.
      * On success it will reload the Store,
      * on failure, it will display an Errormessage
      */
     save: function(button) {
        var formPanel = button.up('ortform');
        var data = formPanel.getForm().getFieldValues(true);
        for (var key in data) {
            formPanel.getForm().getRecord().set(key, data[key]);
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
    * The discard function resets the Location form
    * to its original state.
    */
   discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
        var win = button.up('window');
        var id = formPanel.getForm().getRecord().get('ort');
        var toLoad = Ext.data.StoreManager.get('locations').getById(id);
        win.down('locationform').setRecord(toLoad);
        win.down('map').selectFeature(id);
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
    },

    /**
     *  updateDetails is used when a value is selected within the ort combobox
     *  When this function is called, the map element within the window
     *  which is embedding this form is updated.
     */
    updateDetails: function(combobox, record) {
        var win = combobox.up('window');
        var details = win.down('locationform');
        var id = record[0].get('id');
        if (details) {
            var toLoad = Ext.data.StoreManager.get('locations').getById(id);
            win.down('locationform').setRecord(toLoad);
            win.down('map').selectFeature(id);
        }
    }
});
