/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a Messung form
 */
Ext.define('Lada.controller.form.Messung', {
    extend: 'Lada.controller.form.BaseFormController',
    alias: 'controller.messungform',
    requires: ['Lada.view.window.SetStatus'],

    /**
     * Initialize the Controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'messungform button[action=save]': {
                click: this.save
            },
            'messungform button[action=discard]': {
                click: this.discard
            },
            'messungform button[action=audit]': {
                click: this.showAuditTrail
            },
            'messungform': {
                dirtychange: this.checkCommitEnabled,
                validitychange: this.checkCommitEnabled
            },
            'messungform numfield [name=messdauer]': {
                change: this.messdauerChanged
            },
            'messungform tfield [name=nebenprobenNr]': {
                change: this.nebenprobenNrChanged
            },
            'messungform statuskombi button[action=newstatus]': {
                click: this.addStatus
            }
        });
    },

    /**
     * The save function saves the content of the Location form.
     * On success it will reload the Store,
     * on failure, it will display an Errormessage
     */
    save: function(button) {
        var formPanel = button.up('form');
        formPanel.setLoading(true);
        var record = formPanel.getForm().getRecord();
        // Update record with values changed in the form
        record.set(formPanel.getForm().getFieldValues(false));
        if (record.phantom) {
            record.set('id', null);
        }

        record.save({
            scope: this,
            success: function(newRecord, response) {
                var win = button.up('window');
                var parentWin = win.parentWindow;
                if (parentWin) {
                    parentWin.initData();
                    var messunggrid = parentWin.down('messunggrid');
                    if (messunggrid) {
                        messunggrid.getStore().reload();
                    }
                }

                var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                if (parentGrid.length === 1) {
                    parentGrid[0].reload();
                }

                // Close existing window or update form
                if (win.closeRequested) {
                    win.doClose();
                } else {
                    win.setRecord(newRecord);
                    win.setTitle(win.createTitle());
                    formPanel.setRecord(newRecord);
                    win.down('button[action=tagedit]').setDisabled(false);
                    win.down('button[name=reload]').setDisabled(false);
                    win.disableChildren(
                        newRecord.get('readonly') || !newRecord.get('owner'));
                    var json = Ext.decode(response.getResponse().responseText);
                    win.setMessages(
                        json.errors, json.warnings, json.notifications);
                    var messwertStore = win.down('messwertgrid').getStore();
                    if (messwertStore.isLoaded()) {
                        messwertStore.reload();
                    }
                    //Reload measd store in case mmt changed
                    win.mStore.load({
                        params: {mmtId: newRecord.get('mmtId')}
                    });
                    formPanel.setLoading(false);
                }
            },
            failure: this.handleSaveFailure
        });
    },

    /**
      * The discard function resets the Location form
      * to its original state.
      */
    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().reset();
    },

    checkCommitEnabled: function(callingEl) {
        var panel;
        if (callingEl.up) { //called by a field in the form
            panel = callingEl.up('messungform');
        } else { //called by the form
            panel = callingEl.owner;
        }
        if (panel.getRecord().get('readonly')) {
            panel.down('button[action=save]').setDisabled(true);
            panel.down('button[action=discard]').setDisabled(true);
        } else {
            if (panel.isValid()) {
                if (panel.isDirty()) {
                    panel.down('button[action=discard]').setDisabled(false);
                    panel.down('button[action=save]').setDisabled(false);
                } else {
                    panel.down('button[action=discard]').setDisabled(true);
                    panel.down('button[action=save]').setDisabled(true);
                }
            } else {
                panel.down('button[action=save]').setDisabled(true);
                if ( panel.getRecord().phantom === true && !panel.isDirty() ) {
                    panel.down('button[action=discard]').setDisabled(true);
                } else {
                    panel.down('button[action=discard]').setDisabled(false);
                }
            }
        }
    },

    messdauerChanged: function(field) {
        if (field.getValue() !== null ) {
            field.up().clearWarningOrError();
        } else {
            field.up().showWarnings('Wert nicht gesetzt');
        }
    },

    nebenprobenNrChanged: function(field) {
        if (field.getValue() !== '') {
            field.up().clearWarningOrError();
        } else {
            field.up().showWarnings('Wert nicht gesetzt');
        }
    },

    showAuditTrail: function(button) {
        var titleText = button.up('window').getTitle().split(' - ');
        var trail = Ext.create('Lada.view.window.AuditTrail', {
            autoShow: true,
            closeAction: 'destroy',
            type: 'messung',
            objectId: button.up('form').getRecord().get('id'),
            titleText: titleText[0]
        });
        button.up('window').addChild(trail);
    },

    addStatus: function(button) {
        var i18n = Lada.getApplication().bundle;
        var win = Ext.create('Lada.view.window.SetStatus', {
            title: i18n.getMsg('statusSetzen.win.title'),
            selection: [button.up('messungform').getForm().getRecord()],
            sampleRecord: button.up('messungedit').parentWindow.
                down('probeform').getRecord(),
            modal: true
        });
        var view = button.up('messungform');
        var messwertGrid = button.up('messungedit').down('messwertgrid');
        win.on('statussetend', function() {
            view.record.load({
                success: function(record) {
                    // Update Messung form
                    view.setRecord(record);

                    // Update status grid
                    var editWin = view.up('messungedit');
                    editWin.down('statusgrid').initData();

                    // Enable/disable form and grids
                    view.setReadOnly(record.get('readonly'));
                    editWin.down('messwertgrid')
                        .setReadOnly(record.get('readonly'));
                    editWin.down('mkommentargrid')
                        .setReadOnly(record.get('readonly'));

                    // Update Probe window
                    var parentWin = editWin.parentWindow;
                    if (parentWin) {
                        parentWin.initData();
                        var messunggrid = parentWin.down('messunggrid');
                        if (messunggrid) {
                            messunggrid.getStore().reload();
                        }
                        var ortszuordnunggrid = parentWin.down(
                            'ortszuordnunggrid');
                        if (ortszuordnunggrid) {
                            ortszuordnunggrid.getStore().reload();
                        }
                    }
                }
            });
            var measValStore = messwertGrid.getStore();
            if (measValStore.isLoaded()) {
                measValStore.reload();
            }
        });
        win.show();
    }
});
