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
     * Initialize the Controller
     */
    init: function() {
        this.control({
            'ortform button[action=save]': {
                click: this.save
            },
            'ortform button[action=revert]': {
                click: this.discard
            },
            'ortform staat combobox' : {
                change: this.checkCommitEnabled
            },
            'ortform verwaltungseinheit combobox' : {
                change: this.checkCommitEnabled
            },
            'ortform koordinatenart combobox': {
                change: this.checkCommitEnabled
            },
            'ortform numfield [name=koordXExtern]': {
                change: this.checkCommitEnabled
            },
            'ortform numfield [name=koordYExtern]': {
                change: this.checkCommitEnabled
            },
            'ortform': {
                validitychange: this.checkCommitEnabled,
                dirtychange: this.checkCommitEnabled
            }
        });
    },

    save: function(button) {
        var me = this;
        var formpanel = button.up('ortform');
        var form = formpanel.getForm();
        var record = form.getRecord();
        var data = form.getFieldValues(false);
        for (var key in data) {
            record.set(key, data[key]);
        }
        if (record.phantom) {
            record.set('netzbetreiberId', Lada.netzbetreiber[0]);
            record.set('id', null);
        }
        record.save({
            success: function(newrecord, response) {
                form.loadRecord(newrecord);
                formpanel.down('verwaltungseinheit').store.clearFilter();
                formpanel.down('staat').store.clearFilter();
                button.setDisabled(true);
                formpanel.down('button[action=revert]').setDisabled(true);
                button.hide();
                var ozw = formpanel.up('panel').parentWindow;
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    formpanel.clearMessages();
                    formpanel.setMessages(json.errors, json.warnings);
                }
                if (ozw.ortstore) {
                    ozw.ortstore.load({
                        callback: function(){
                            var osg = ozw.down('ortstammdatengrid');
                            osg.setStore(ozw.ortstore);
                            ozw.down('map').addLocations(ozw.ortstore);
                            me.afterSave(formpanel, json);
                        }
                    });
                }
            },
            failure: function(record, response) {
                var i18n = Lada.getApplication().bundle;
                if (response.error){
                    //TODO: check content of error.status (html error code)
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                  i18n.getMsg('err.msg.generic.body'));
                } else {
                    var json = Ext.decode(response.getResponse().responseText);
                    if (json) {
                        if(json.message){
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title')
                            +' #'+ json.message,
                            i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
                        formpanel.clearMessages();
                        formpanel.setMessages(json.errors, json.warnings);
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                            i18n.getMsg('err.msg.response.body'));
                    }
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
            ozw.down('tabpanel').setActiveTab(0);
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
            panel = callingEl.up('ortform');
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
