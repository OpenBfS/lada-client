/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a Datensatzerzeuger Stammdaten forms
 */
Ext.define('Lada.controller.form.DatensatzErzeuger', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'datensatzerzeugerform button[action=save]': {
                click: this.save
            },
            'datensatzerzeugerform button[action=discard]': {
                click: this.discard
            },
            'datensatzerzeugerform button[action=copy]': {
                click: this.copyDatensatzerzeuger
            },
            'datensatzerzeugerform [name="datensatzErzeugerId"]': {
                change: this.checkCommitEnabled
            },
            'datensatzerzeugerform [name="bezeichnung"]': {
                change: this.checkCommitEnabled
            },
            'datensatzerzeugerform [name="mstId"]': {
                change: this.checkCommitEnabled
            },
            'datensatzerzeugerform [name="netzbetreiberId"]': {
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
                button.up('datensatzerzeugeredit')
                    .down('button[action=discard]')
                    .setDisabled(true);
                button.up('datensatzerzeugeredit')
                    .down('button[action=copy]')
                    .setDisabled(false);
                Ext.data.StoreManager.get('datensatzerzeuger').reload();
            },
            failure: function(newRecord, response) {
                var i18n = Lada.getApplication().bundle;
                if (response.error) {
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                        i18n.getMsg('err.msg.generic.body'));
                } else {
                    formPanel.down(
                        'tfield[name=datensatzErzeugerId]').setValue();
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
                    button.up('datensatzerzeugeredit').down(
                        'button[action=discard]').setDisabled(true);
                    formPanel.isValid();
                }
            }
        });
    },

    copyDatensatzerzeuger: function(button) {
        var record = button.up('datensatzerzeugerform').getForm().getRecord();
        var copy = record.copy(null);
        copy.set('datensatzErzeugerId', null);
        var win = Ext.create('Lada.view.window.DatensatzErzeuger', {
            record: copy,
            mode: 'copy',
            original: record
        });
        var pos = button.up('datensatzerzeugerform').up().getPosition();
        pos[0] += 10;
        pos[1] += 10;
        win.show();
        win.setPosition(pos);
    },

    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().reset();
        formPanel.getForm().isValid();
        formPanel.up('datensatzerzeugeredit').down(
            'button[action=discard]').setDisabled(true);
        formPanel.up('datensatzerzeugeredit').down(
            'button[action=save]').setDisabled(true);
        formPanel.up('datensatzerzeugeredit').down(
            'button[action=copy]').setDisabled(true);
    },

    checkCommitEnabled: function(callingEl) {
        var panel;
        if (callingEl.up) { //called by a field in the form
            panel = callingEl.up('datensatzerzeugerform');
        } else { //called by the form
            panel = callingEl.owner;
        }
        if (!panel.getRecord().phantom && panel.getRecord().get('readonly')) {
            panel.down('button[action=save]').setDisabled(true);
            panel.down('button[action=discard]').setDisabled(true);
            panel.down('button[action=copy]').setDisabled(true);
            return;
        }
        if (
            panel.isValid() &&
            panel.down('netzbetreiber[name=netzbetreiberId]')
                .getValue().length !== 0
        ) {
            if (panel.isDirty()) {
                panel.down('button[action=save]').enable();
                panel.down('button[action=discard]').enable();
                if (!panel.getRecord().phantom) {
                    panel.down('button[action=copy]').setDisabled(true);
                }
            } else {
                panel.down('button[action=save]').setDisabled(true);
                panel.down('button[action=discard]').setDisabled(true);
                panel.down('button[action=copy]').setDisabled(false);
            }
        } else { //form invalid
            if (panel.isDirty()) {
                panel.down('button[action=save]').setDisabled(true);
                panel.down('button[action=discard]').setDisabled(false);
                panel.down('button[action=copy]').setDisabled(true);
            } else {
                panel.down('button[action=save]').setDisabled(true);
                panel.down('button[action=discard]').setDisabled(true);
                panel.down('button[action=copy]').setDisabled(true);
            }
        }
    }
});
