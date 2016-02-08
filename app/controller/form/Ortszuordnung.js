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
                toggle: this.pickOrt
            },
            'ortszuordnungform button[action=save]': {
                click: this.save
            },
            'ortszuordnungform button[action=discard]': {
                click: this.discard
            },
            'ortszuordnungform': {
                dirtychange: this.dirtyForm
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

        var data = formPanel.getForm().getFieldValues(true);
        debugger;
        console.log(data);
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
        var record = formPanel.getForm().getRecord();
        formPanel.getForm().loadRecord(record);
        try {
            formPanel.refreshOrt(record.get('ortId'));
            formPanel.down('button[action=setOrt]').toggle(false);
        }
        catch (e) {
        }
        //set undirty.
        formPanel.fireEvent('dirtychange', formPanel.getForm(), false);
    },

    /**
     * When the button is Active, a Record can be selected.
     * If the Record was selected from a grid this function
     *  sets the ortzuordnung.
     * TODO: Check if the selected Record is a ORT
     * TODO: Enable picking from Maps
     */
     pickOrt: function(button, pressed, opts) {
        var i18n = Lada.getApplication().bundle;
        var oForm = button.up('form');
        var osg = button.up('window').down('ortstammdatengrid');
        if (button.pressed) {
            button.setText(i18n.getMsg('ortszuordnung.form.setOrt.pressed'));
            osg.addListener('select',oForm.setOrt, oForm);
        }
        else {
            button.setText(i18n.getMsg('ortszuordnung.form.setOrt'));
            osg.removeListener('select',oForm.setOrt, oForm);
        }
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
