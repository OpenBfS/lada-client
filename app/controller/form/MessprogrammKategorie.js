/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for MessprogrammKategorie Stammdaten forms
 */
Ext.define('Lada.controller.form.MessprogrammKategorie', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'mprkatform button[action=save]': {
                click: this.save
            },
            'mprkatform button[action=discard]': {
                click: this.discard
            },
            'mprkatform': {
                dirtychange: this.checkCommitEnabled
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
                }
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
            }
        });
    },

    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().reset();
        formPanel.down('button[action=discard]').setDisabled(true);
        formPanel.down('button[action=save]').setDisabled(true);
    },

    checkCommitEnabled: function(callingEl, dirty) {
        var form = callingEl.owner;
        var netzbetr = form.down('netzbetreiber').getValue();
        if (Ext.Array.contains(Lada.funktionen, 4)
        && form.getRecord().get('readonly') === false
        && netzbetr && dirty) {
            if (form.isValid()) {
                form.down('button[action=save]').enable();
            } else {
                form.down('button[action=save]').setDisabled(true);
            }
        } else {
            form.down('button[action=discard]').setDisabled(true);
            form.down('button[action=save]').setDisabled(true);
        }
    }
});
