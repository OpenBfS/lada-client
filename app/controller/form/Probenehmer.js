/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Probenehmer Stammdaten
 */
Ext.define('Lada.controller.form.Probenehmer', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'probenehmerform button[action=save]': {
                click: this.save
            },
            'probenehmerform button[action=discard]': {
                click: this.discard
            },
            'probenehmerform button[action=copy]': {
                click: this.copyProbenehmer
            },
            'probenehmerform': {
                dirtychange: this.handleDirtyChange,
                validitychange: this.checkCommitEnabled,
                save: this.saveHeadless
            },
            'probenehmerform netzbetreiber combobox': {
                change: this.checkCommitEnabled
            },
            'probenehmerform tfield [name=plz]': {
                change: this.checkCommitEnabled
            }
        });
    },

    save: function(button) {
        var formPanel = button.up('form');
        var data = formPanel.getForm().getFieldValues(false);
        var record = formPanel.getForm().getRecord();
        for (var key in data) {
            record.set(key, data[key]);
        }
        record.set('netzbetreiberId',
            formPanel.down('netzbetreiber').getValue()[0]);
        if (!record.get('letzteAenderung')) {
            record.set('letzteAenderung', new Date());
        }
        if (record.phantom) {
            record.set('id', null);
        }
        record.save({
            success: function(newRecord, response) {
                var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                if (parentGrid.length === 1) {
                    parentGrid[0].reload();
                }
                var rec = formPanel.getForm().getRecord();
                rec.dirty = false;
                formPanel.getForm().loadRecord(newRecord);
                var json = Ext.decode(response.getResponse().responseText);
                formPanel.clearMessages();
                formPanel.setRecord(newRecord);
                formPanel.setMessages(json.errors, json.warnings);
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                Ext.data.StoreManager.get('probenehmer').reload();
            },
            failure: function(newRecord, response) {
                var i18n = Lada.getApplication().bundle;
                if (response.error) {
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                        i18n.getMsg('err.msg.generic.body'));
                } else {
                    formPanel.getForm().reset();
                    var json = Ext.decode(response.getResponse().responseText);
                    if (json) {
                        if (json.message) {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title')
                                +' #'+json.message,
                            i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
                        formPanel.clearMessages();
                        formPanel.setMessages(json.errors, json.warnings);
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                            i18n.getMsg('err.msg.response.body'));
                    }
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                }
            }
        });
    },

    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().reset();
        formPanel.down('button[action=discard]').setDisabled(true);
        formPanel.down('button[action=save]').setDisabled(true);
    },

    saveHeadless: function(panel) {
        var formPanel = panel;
        var data = formPanel.getForm().getFieldValues(false);
        var record = formPanel.getForm().getRecord();
        for (var key in data) {
            record.set(key, data[key]);
        }
        if (!record.get('letzteAenderung')) {
            record.set('letzteAenderung', new Date());
        }
        if (record.phantom) {
            record.set('id', null);
        }
        record.save({
            success: function(newRecord, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                    if (parentGrid.length === 1) {
                        parentGrid[0].reload();
                    }
                }
            },
            failure: function(newRecord, response) {
                var i18n = Lada.getApplication().bundle;
                if (response.error) {
                    //TODO: check content of error.status (html error code)
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                        i18n.getMsg('err.msg.generic.body'));
                } else {
                    var rec = formPanel.getForm().getRecord();
                    rec.dirty = false;
                    var json = Ext.decode(response.getResponse().responseText);
                    if (json) {
                        if (json.message) {
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
            }
        });
    },

    copyProbenehmer: function(button) {
        var record = button.up('probenehmerform').getForm().getRecord();
        var copy = record.copy(null);
        copy.set('prnId', null);
        var win = Ext.create('Lada.view.window.Probenehmer', {
            record: copy,
            mode: 'copy',
            original: record
        });
        var pos = button.up('probenehmerform').up().getPosition();
        pos[0] += 10;
        pos[1] += 10;
        win.show();
        win.setPosition(pos);
    },

    checkCommitEnabled: function(callingEl) {
        var form;
        if ( //called by a field
            callingEl.up &&
            callingEl.up('probenehmerform')
        ) {
            form = callingEl.up('probenehmerform');
        } else if (callingEl.owner) { //called by the form
            form = callingEl.owner;
        } else {
            form = callingEl; //called by the formpanel itself
        }
        var savebutton = form.down('button[action=save]');
        var revertbutton = form.down('button[action=discard]');
        var copybutton = form.down('button[action=copy]');
        if (!form.getRecord().phantom && form.getRecord().get('readonly')) {
            savebutton.setDisabled(true);
            revertbutton.setDisabled(true);
            copybutton.setDisabled(true);
            return;
        }
        if (
            form.isValid() &&
            form.down('netzbetreiber[name=netzbetreiberId]')
                .getValue().length !== 0
        ) {
            if (form.isDirty()) {
                savebutton.enable();
                revertbutton.enable();
                if (!form.getRecord().phantom) {
                    copybutton.setDisabled(true);
                }
            } else {
                savebutton.setDisabled(true);
                revertbutton.setDisabled(true);
                copybutton.setDisabled(false);
            }
        } else { //form invalid
            if (form.isDirty()) {
                savebutton.setDisabled(true);
                revertbutton.enable();
                copybutton.setDisabled(true);
            } else {
                savebutton.setDisabled(true);
                revertbutton.setDisabled(true);
                copybutton.setDisabled(true);
            }
        }
    },

    handleDirtyChange: function(callingEl) {
        var form = callingEl.owner;
        form.down('button[action=discard]').setDisabled(false);
        this.checkCommitEnabled(callingEl, form.isValid());
    }
});
