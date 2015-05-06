/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A Controller for a Probe form
 */
Ext.define('Lada.controller.form.Messprogramm', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller
     */
    init: function() {
        this.control({
            'messprogrammform button[action=save]': {
                click: this.save
            },
            'messprogrammform button[action=discard]': {
                click: this.discard
            },
            'messprogrammform': {
                dirtychange: this.dirtyForm
            },
            'messprogrammform [xtype="numberfield"]': {
                change: this.synchronizeSlider,
                blur: this.checkPeriod
            },
            'messprogrammform probenintervall combobox': {
                select: this.updateIntervalls
            }
        });
    },
    /**
     * When the Probenintervall was changed, update the Sliders
     * and the the numberfield.
     */
    updateIntervalls: function(field, records) {
        console.log('update Intervalls');
        var form = field.up('messprogrammform');
        var record = form.getRecord();
        form.populateIntervall(record, field.getValue());
    },

    /**
     * When the Slider was used,
     * update the Value of the Teilintervallfields
     */
    synchronizeFields: function(slider, newValue, thumb) {
        console.log('Synchronize Fields');
        var formPanel = slider.up('form');
        if (thumb.index == 0) {
            formPanel.getForm()
                .findField('teilintervallVon')
                .setValue(newValue);
        }
        else if (thumb.index == 1) {
            formPanel.getForm()
                .findField('teilintervallBis')
                .setValue(newValue);
         }

    },

    /**
     * When the IntervallFields were used,
     * update the Slider
     */
    synchronizeSlider: function(field, newValue, oldValue) {
        console.log('Synchronize Slider');
        var formPanel = field.up('form');
        if (field.name == 'teilintervallVon') {
            formPanel.down('probenintervallslider')
                .setValue(0, newValue, false);
        }
        else if (field.name == 'teilintervallBis') {
            formPanel.down('probenintervallslider')
                .setValue(1, newValue, false);
         }

    },
    /**
     * The save function saves the content of the Location form.
     * On success it will reload the Store,
     * on failure, it will display an Errormessage
     */
    save: function(button) {
        var formPanel = button.up('form');
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
                    if (response.action === 'create' && json.success) {
                        button.up('window').close();
                        var win = Ext.create('Lada.view.window.MessprogrammEdit', {
                            record: record
                        });
                        win.show();
                        win.initData();
                    }
                }
            },
            failure: function(record, response) {
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                var rec = formPanel.getForm().getRecord();
                rec.dirty = false;
                formPanel.getForm().loadRecord(record);
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
                    formPanel.clearMessages();
                    //formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
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
        formPanel.getForm().owner.populateIntervall(
            formPanel.getForm().getRecord());
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
     * checkPeriod() is called when a fields defining an intervall
     * were modified
     * The function validates if the start is smaller than end.
     */
    checkPeriod: function(field) {

        // This field might be a field within a Period.
        // Search for Partner field (period: end/start) and validate
        // End Before Start validation
        if (field.period) {
            var partners = new Array();
                partners[0] = field.up('fieldset').down('numberfield[period=start]').getValue()
                partners[1] = field.up('fieldset').down('numberfield[period=end]').getValue()
            if (partners[0] && partners[1] && partners[0] > partners [1]) {
                var msg = Lada.getApplication().bundle.getMsg('662');
                field.up('fieldset').showWarningOrError(true, msg, false, '');
            } else {
                field.up('fieldset').clearMessages();
            }
        }
    }
});
