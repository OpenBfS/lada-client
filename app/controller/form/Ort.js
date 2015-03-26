/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.form.Ort', {
    extend: 'Ext.app.Controller',

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
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('errmsgtitle')
                            +' '+json.message,
                            Lada.getApplication().bundle.getMsg(json.message));
                    }
                }
            }
        });
    },

    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
        var win = button.up('window');
        var id = formPanel.getForm().getRecord().get('ort');
        var toLoad = Ext.data.StoreManager.get('locations').getById(id);
        win.down('locationform').setRecord(toLoad);
        win.down('map').selectFeature(id);
    },

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
