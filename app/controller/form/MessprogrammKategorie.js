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
    extend: 'Lada.controller.form.BaseFormController',
    alias: 'controller.mprkatform',

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
            scope: this,
            success: function(newRecord, response) {
                var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                if (parentGrid.length === 1) {
                    parentGrid[0].reload();
                }

                var win = button.up('window');
                if (win.closeRequested) {
                    win.doClose();
                } else {
                    formPanel.loadRecord(newRecord);
                    formPanel.clearMessages();
                    var json = Ext.decode(response.getResponse().responseText);
                    formPanel.setMessages(json.errors, json.warnings);
                }
            },
            failure: function(newRecord, response) {
                this.handleSaveFailure(newRecord, response);
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
