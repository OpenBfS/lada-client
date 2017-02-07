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
            },
        });
    },

    save: function(button) {
        var me = button.up('panel');
        var form = me.getForm();
        var record = form.getRecord();
        var data = form.getFieldValues(true);
        for (var key in data) {
            record.set(key, data[key]);
        }
        record.set('id', null);
        record.set('netzbetreiberId', Lada.netzbetreiber[0]);
        record.save({
            success: function(newrecord, response) {
                form.loadRecord(newrecord);
                me.down('verwaltungseinheit').store.load(
                        { id:newrecord.get('gemId') });
                me.down('staat').store.load(
                        { id : newrecord.get('staat') });
                button.setDisabled(true);
                me.down('button[action=revert]').setDisabled(true);
                button.hide();
                var ozw = me.up('window').parentWindow;
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    me.clearMessages();
                    me.setMessages(json.errors, json.warnings);
                }
                ozw.ortstore.load({
                    callback: function(records, operation, success) {
                        ozw.down('map').addLocations(ozw.ortstore);
                        var osg = ozw.down('ortstammdatengrid');
                        osg.setStore(ozw.ortstore);
                        var id = Ext.decode(response.response.responseText).data.id;
                        var record = osg.store.getById(id);
                        var selmod = osg.getView().getSelectionModel();
                        selmod.select(record);
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
                    scope: this
                });

            },
            failure: function(record, response) {
                var json = Ext.decode(response.response.responseText);
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
                me.setDisabled(true);
            }
        });
    },

    discard: function(button) {
        button.up('panel').reset();
        button.up('panel').down('button [action=save]').setDisabled(true);
    },

    /**
     * checks if the Messpunkt can be committed.
     * Disables the save button if false
     */
    checkCommitEnabled: function(callingEl) {
        var panel;
        if (callingEl.up) { //called by a field in the form
            panel = callingEl.up('panel').up('panel');
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
