/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * This is a controller for an Ortserstellung Form
 */
Ext.define('Lada.controller.form.Ortserstellung', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller
     */
    init: function() {
        this.control({
            'ortserstellungsform button[action=save]': {
                click: this.save
            },
            'ortserstellungsform button[action=revert]': {
                click: this.discard
            },
            'ortserstellungsform staat combobox' : {
                change: this.checkCommitEnabled
            },
            'ortserstellungsform verwaltungseinheit combobox' : {
                change: this.checkCommitEnabled
            },
            'ortserstellungsform koordinatenart combobox': {
                change: this.checkCommitEnabled
            },
            'ortserstellungsform numfield [name=koordXExtern]': {
                change: this.checkCommitEnabled
            },
            'ortserstellungsform numfield [name=koordYExtern]': {
                change: this.checkCommitEnabled
            },
            'ortserstellungsform': {
                validitychange: this.checkCommitEnabled,
                dirtychange: this.checkCommitEnabled
            }
        });
    },

    save: function(button) {
        var me = this;
        var formpanel = button.up('ortserstellungsform');
        var form = formpanel.getForm();
        var record = form.getRecord();
        var data = form.getFieldValues();
        for (var key in data) {
            record.set(key, data[key]);
        }
        record.set('id', null);
        record.set('netzbetreiberId', Lada.netzbetreiber[0]);
        record.save({
            success: function(newrecord, response) {
                form.loadRecord(newrecord);
                formpanel.down('verwaltungseinheit').store.clearFilter();
                formpanel.down('staat').store.clearFilter();
                button.setDisabled(true);
                formpanel.down('button[action=revert]').setDisabled(true);
                button.hide();
                var ozw = formpanel.up('panel').parentWindow;
                var json = Ext.decode(response._response.responseText);
                if (json) {
                    formpanel.clearMessages();
                    formpanel.setMessages(json.errors, json.warnings);
                }
                if (ozw.ortstore) {
                    ozw.ortstore.add(newrecord);
                    ozw.down('map').addLocations(ozw.ortstore); //TODO
                    var osg = ozw.down('ortstammdatengrid');
                    osg.setStore(ozw.ortstore);
                    me.afterSave(formpanel, json);
                }
                //TODO other parents might have other stores
            },
            failure: function(record, response) {
                var json = response._request._jsonData;
                if (json) {
                    if(json.message){
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title')
                            +' #'+json.message,
                             Lada.getApplication().bundle.getMsg(json.message));
                    } else {
                         Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                             Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                    }
                    formpanel.clearMessages();
                    formpanel.setMessages(json.errors, json.warnings);
                } else {
                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                        Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                }
            }
        });
    },

    /**
     * Callbacks after a Ort has been saved
     */
    afterSave: function(form, json) {
        var ozw = form.up('panel').parentWindow;
        var osg = ozw.down('ortstammdatengrid');
        var id = json.data.id;
        var record = ozw.ortstore.getById(id);
        if (record) {
            var selmod = osg.getView().getSelectionModel();
            selmod.select(record);
        }
        var resulttext;
        if (json) {
            if (json.message == '201') {
                resulttext = 'Dieser Ort existiert bereits!';
            }
            if (json.message == '200') {
                resulttext = 'Ort erfolgreich angelegt!';
            }
        }
        Ext.Msg.show({
            title: Lada.getApplication().bundle.getMsg('success'),
                     autoScroll: true,
                     msg: resulttext,
                     buttons: Ext.Msg.OK
        });
    },

    discard: function(button) {
        button.up('panel').getForm().reset();
    },

    /**
     * checks if the Messpunkt can be committed.
     * Disables the save button if false
     */
    checkCommitEnabled: function(callingEl) {
        var panel;
        if (callingEl.up) { //called by a field in the form
            panel = callingEl.up('ortserstellungsform');
        } else { //called by the form
            panel = callingEl.owner;
        }
        var savebutton =  panel.down('button[action=save]');
        var form = panel.getForm();
        if (form.isDirty()) {
            panel.down('button[action=revert]').setDisabled(false);
        } else {
            panel.down('button[action=revert]').setDisabled(true);
        }
        if (form.isValid()) {
            //one of three conditions must apply, the first one depending
            // on three fields
            if (
                (form.findField('kdaId').getValue()
                    && form.findField('koordYExtern').getValue()
                    && form.findField('koordXExtern').getValue()
                )
                || form.findField('gemId').getValue() !== null
                || form.findField('staatId').getValue() !== null
                ) {
                savebutton.setDisabled(false);
            } else {
                savebutton.setDisabled(true);
            }
        } else { //form invalid
            savebutton.setDisabled(true);
        }
    }
});
