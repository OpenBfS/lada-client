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
    extend: 'Ext.app.Controller',
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
                dirtychange: this.dirtyForm,
                save: this.saveHeadless,
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
        var oldWin = button.up('window');
        var parentWin = oldWin.parentWindow;
        var probe = oldWin.record;
        formPanel.setLoading(true);
        var record = formPanel.getForm().getRecord();
        var data = formPanel.getForm().getFieldValues();
        for (var key in data) {
            record.set(key, data[key]);
        }
        if (record.phantom) {
            record.set('id', null);
        }

        formPanel.getForm().getRecord().save({
            success: function(newRecord, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                    formPanel.clearMessages();
                    formPanel.setRecord(newRecord);
                    formPanel.setMessages(json.errors, json.warnings,
                        json.notifications);
                    //formPanel.up('window').initData(newRecord);

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
                    if (response.action === 'create' && json.success) {
                        oldWin.close();
                        var win = Ext.create('Lada.view.window.MessungEdit', {
                            probe: probe,
                            parentWindow: parentWin,
                            grid: oldWin.grid,
                            record: record
                        });
                        win.initData(record);
                        win.show();
                        win.setMessages(json.errors, json.warnings,
                            json.notifications);
                        win.setPosition(35 + parentWin.width);
                    } else {
                        oldWin.down('messwertgrid').getStore().reload();
                    }
                }
                formPanel.setLoading(false);
            },
            failure: function(newRrecord, response) {
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
                var i18n = Lada.getApplication().bundle;
                if (response.error) {
                    //TODO: check content of error.status (html error code)
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
                        formPanel.clearMessages();
                        formPanel.setRecord(record);
                        formPanel.setMessages(json.errors, json.warnings,
                            json.notifications);
                        formPanel.up('window').initData();
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                            i18n.getMsg('err.msg.response.body'));
                    }
                    formPanel.setLoading(false);
                }
            }
        });
    },

    enableButtons: function(form) {
        form.owner.down('button[action=save]').setDisabled(false);
        form.owner.down('button[action=discard]').setDisabled(false);
        form.owner.up('window').disableChildren();
    },

    disableButtons: function(form) {
        form.owner.down('button[action=save]').setDisabled(true);
        form.owner.down('button[action=discard]').setDisabled(true);
        // todo next line might not be true in all cases (Jan 2020)
        form.owner.up('window').enableChildren();
    },


    /**
     * Saves the current form without manipulating the gui
     */
    saveHeadless: function(panel) {
        var formPanel = panel;
        var record = formPanel.getForm().getRecord();
        var data = formPanel.getForm().getFieldValues();
        for (var key in data) {
            record.set(key, data[key]);
        }
        if (record.phantom) {
            record.set('id', null);
        }

        formPanel.getForm().getRecord().save({
            success: function(newRecord, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    var parentGrid = Ext.ComponentQuery.query('dynamicGrid');
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
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                            i18n.getMsg('err.msg.response.body'));
                    }
                    formPanel.setLoading(false);
                }
            }
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



    /**
      * The dirtyForm function enables or disables the save and discard
      * button which are present in the toolbar of the form.
      * The Buttons are only active if the content of the form was altered
      * (the form is dirty).
      * In Additon it calls the disableChildren() function of the window
      * embedding the form. Only when the record does not carry the readonly
      * flag, the function calls the embedding windows enableChilren() function
      */
    dirtyForm: function(form, dirty) {
        if (dirty) {
            if (form.isValid()) {
                form.owner.down('button[action=save]').setDisabled(false);
            }
            form.owner.down('button[action=discard]').setDisabled(false);
            form.owner.up('window').disableChildren();
        } else {
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=discard]').setDisabled(true);
            //Only enable children if the form was not readOnly
            if (!form.getRecord().get('readonly')) {
                form.owner.up('window').enableChildren();
            }
        }
    },

    showAuditTrail: function(button) {
        var titleText = button.up('window').getTitle().split(' - ');
        var trail = Ext.create('Lada.view.window.AuditTrail', {
            autoShow: true,
            closeAction: 'destroy',
            type: 'messung',
            objectId: button.up('form').recordId,
            titleText: titleText[0]
        });
        button.up('window').addChild(trail);
    },

    addStatus: function(button) {
        var i18n = Lada.getApplication().bundle;
        var win = Ext.create('Lada.view.window.SetStatus', {
            title: i18n.getMsg('statusSetzen.win.title'),
            selection: [button.up('window')
                .down('messungform').getForm().getRecord()],
            modal: true
        });
        var view = button.up('messungform');
        var messwertGrid = button.up('messungedit').down('messwertgrid');
        win.on('statussetend', function() {
            view.record.load({
                success: function() {
                    view.setRecord(view.record);
                    view.setReadOnly(view.record.get('readonly'));
                    view.up('messungedit').down('messwertgrid')
                        .setReadOnly(view.record.get('readonly'));
                    view.up('messungedit').down('mkommentargrid')
                        .setReadOnly(view.record.get('readonly'));

                    var parentWin = view.up('window').parentWindow;
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
            messwertGrid.getStore().reload();
        });
        win.show();
    }
});
