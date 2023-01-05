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
                dirtychange: this.checkCommitEnabled,
                validitychange: this.checkCommitEnabled
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
        if (record.phantom) {
            record.set('id', null);
        }
        record.save({
            success: function(newRecord, response) {
                var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                if (parentGrid.length === 1) {
                    parentGrid[0].reload();
                }

                formPanel.getForm().loadRecord(newRecord);
                var json = Ext.decode(response.getResponse().responseText);
                formPanel.clearMessages();
                formPanel.setMessages(json.errors, json.warnings);
            },
            failure: function(newRecord, response) {
                formPanel.loadRecord(record);
                var i18n = Lada.getApplication().bundle;
                if (response.error) {
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                        i18n.getMsg('err.msg.generic.body'));
                } else {
                    var json = Ext.decode(response.getResponse().responseText);
                    if (json) {
                        if (json.message) {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title')
                                + ' #' + json.message,
                            i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
                        formPanel.setMessages(json.errors, json.warnings);
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                            i18n.getMsg('err.msg.response.body'));
                    }
                }
            }
        });
    },

    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().reset();
    },

    checkCommitEnabled: function(callingEl) {
        var form = callingEl.owner;
        if (Ext.Array.contains(Lada.funktionen, 4)
            && form.getRecord().get('readonly') === false
        ) {
            var isDirty = form.isDirty();
            form.down('button[action=discard]').setDisabled(!isDirty);
            var isValid = form.isValid();
            form.down('button[action=save]').setDisabled(!isValid || !isDirty);
        } else {
            form.down('button[action=discard]').setDisabled(true);
            form.down('button[action=save]').setDisabled(true);
        }
    }
});
