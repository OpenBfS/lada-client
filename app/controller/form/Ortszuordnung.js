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
            'ortszuordnungform button[action=setOrt]': {
                toggle: this.chooseLocation
            },
            'ortszuordnungform button[action=save]': {
                click: this.save
            },
            'ortszuordnungform button[action=discard]': {
                click: this.discard
            },
            'ortszuordnungform': {
                validitychange: this.validityChange,
                dirtychange: this.validityChange
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

        //try to disable ortPickerButton:
        try {
           formPanel.down('button[action=setOrt]').toggle(false);
        }
        catch (e) {
        }
        var data = formPanel.getForm().getFieldValues(false);
        var i18n = Lada.getApplication().bundle;
        //TODO: the forms seem not to submit anything into record.
        var recordData = formPanel.getForm().getRecord().data;
        if (recordData['probeId'] !== undefined) {
            // TODO: as model.ort.ortId and model.ortszuordnung.ortId coexist,
            // but mean different things, data.ortId is an array here, of
            // which we need the first entry
            recordData.ortId = data.ortId[0];
            recordData.ortszuordnungTyp = data.ortszuordnungTyp;
        } else { //messprogramm
            recordData.ortsTyp = data.ortsTyp;
            recordData.ort = data.ort;
        }
        recordData.ortszusatztext = data.ortszusatztext;
        if (!data.letzteAenderung) {
            recordData.letzteAenderung = new Date();
        } else {
            recordData.letzteAenderung = data.letzteAenderung;
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
                    formPanel.up('window').parentWindow.initData();
                }
                //try to refresh the Grid of the Probe
                try {
                    formPanel.up('window').parentWindow
                        .down('ortszuordnunggrid').store.reload();
                }
                catch (e) {

                }
            },
            failure: function(record, response) {
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
                var json = response.request.scope.reader.jsonData;
                if (json) {
                    if(Object.keys(json.errors).length > 0 ||
                        Object.keys(json.warnings).length > 0) {

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
        var record = formPanel.getForm().getRecord();
        formPanel.getForm().loadRecord(record);
        try {
            if (record.get('ortId') !== undefined) {
                formPanel.setOrt(record.get('ortId'));
            } else {
                formPanel.setOrt(record.get('ort'));
            }
            formPanel.down('button[action=setOrt]').toggle(false);
        }
        catch (e) {
        }
    },

    /**
     * When the button is Active, a Record can be selected.
     * If the Record was selected from a grid this function
     * sets the ortzuordnung.
     */
    chooseLocation: function(button, pressed, opts) {
        var i18n = Lada.getApplication().bundle;
        var win = button.up('window');
        var gridPanel = win.down('panel[name=ortgrid]');
        var osg = win.down('ortstammdatengrid');
        var oForm = button.up('form');
        osg.addListener('select',oForm.setOrt, oForm);
        if (pressed) {
            win.setHeight(Ext.getBody().getViewSize().height - 50);
            button.setText(i18n.getMsg('ortszuordnung.form.setOrt.pressed'));
            win.setY(25);
            gridPanel.show();
            osg.addListener('select',oForm.setOrt, oForm);

        }
        else {
            var y = (Ext.getBody().getViewSize().height - 465) / 2
            win.setHeight(465);
            win.setY(y);
            button.setText(i18n.getMsg('ortszuordnung.form.setOrt'));
            gridPanel.hide();
            osg.removeListener('select',oForm.setOrt, oForm);
        }
    },

    /**
     * The validitychange function enables or disables the save and discard
     * button which are present in the toolbar of the form.
     */
    validityChange: function(form, valid) {
        if (form.isDirty()) {
            form.owner.down('button[action=discard]').setDisabled(false);
            if (valid) {
                if (form.getValues().ortId !== ''
                    && /[UEZA]/.test(form.getValues().ortszuordnungTyp)) {
                    // valid ortzuordnung(Probe)
                        form.owner.down('button[action=save]').setDisabled(false);
                } else if (form.getValues().ort !== ''
                    && /[UEZA]/.test(form.getValues().ortsTyp)) {
                    // valid ortzuordnung(messprogramm)
                    form.owner.down('button[action=save]').setDisabled(false);
                } else {
                    form.owner.down('button[action=save]').setDisabled(true);
                }
            } else {
                //invalid
                form.owner.down('button[action=save]').setDisabled(true);
            }
        } else {
            //not dirty
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=discard]').setDisabled(true);
        }
    }
});
