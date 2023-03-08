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
    extend: 'Lada.controller.form.BaseFormController',
    alias: 'controller.probenehmerform',

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
                dirtychange: this.checkCommitEnabled,
                validitychange: this.checkCommitEnabled
            }
        });
    },

    save: function(button) {
        var formPanel = button.up('form');
        var record = formPanel.getForm().getRecord();
        // Update record with values changed in the form
        record.set(formPanel.getForm().getFieldValues(true));
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
                Ext.data.StoreManager.get('probenehmer').reload();

                var win = button.up('window');
                if (win.closeRequested) {
                    win.doClose();
                } else {
                    formPanel.setRecord(newRecord);
                    var json = Ext.decode(response.getResponse().responseText);
                    formPanel.setMessages(json.errors, json.warnings);
                }
            },
            failure: this.handleSaveFailure
        });
    },

    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().reset();
    },

    copyProbenehmer: function(button) {
        var record = button.up('probenehmerform').getForm().getRecord();
        var copy = record.copy(null);
        copy.set('prnId', null);
        var win = Ext.create('Lada.view.window.Probenehmer', {
            record: copy,
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
    }
});
