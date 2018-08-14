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
                save: this.saveHeadless
            },
            'messungform statuskombi button[action=newstatus]': {
                click: this.addStatus
            },
            'messungform statuskombi button[action=resetstatus]': {
                click: this.resetStatus
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
        var data = formPanel.getForm().getFieldValues();
        for (var key in data) {
            record.set(key, data[key]);
        }
        if (record.phantom) {
            record.set('id', null);
        }
        formPanel.getForm().getRecord().save({
            success: function(record, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                    formPanel.clearMessages();
                    formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                    formPanel.up('window').initData();

                    var parentWin = button.up('window').parentWindow;
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
                    if (messwertgrid) {
                        messwertgrid.store.reload();
                    }
                    if (response.action === 'create' && json.success) {
                        var oldWin = button.up('window');
                        var probe = oldWin.record;
                        oldWin.close();
                        var win = Ext.create('Lada.view.window.MessungEdit', {
                            probe: probe,
                            parentWindow: parentWin,
                            grid: oldWin.grid,
                            record: record
                        });
                        win.show();
                        win.setPosition(window.innerWidth - 30 -win.width);
                        win.initData();
                    }
                }
                formPanel.setLoading(false);
            },
            failure: function(record, response) {
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
                        formPanel.setMessages(json.errors, json.warnings);
                        formPanel.up('window').initData();
                        formPanel.up('window').grid.store.reload();
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
            success: function(record, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    var parentGrid = Ext.ComponentQuery.query('dynamicGrid');
                    if (parentGrid.length === 1) {
                        parentGrid[0].reload();
                    }
                }
            },
            failure: function(record, response) {
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
            form.owner.down('button[action=save]').setDisabled(false);
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
        Ext.create('Lada.view.window.AuditTrail', {
            autoShow: true,
            closeAction: 'destroy',
            type: 'messung',
            objectId: button.up('form').recordId
        });
    },

    addStatus: function(button) {
        var i18n = Lada.getApplication().bundle;
        var win = Ext.create('Lada.view.window.SetStatus', {
            title: i18n.getMsg('statusSetzen.win.title'),
            record: button.up('window').down('messungform').getForm().getRecord(),
            modal: true
        });
        var view = button.up().up().up().up();
        win.on('statussetend', function() {
            view.updateStatusText();
        });
        win.show();
    },

    resetStatus: function(button) {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(
            i18n.getMsg('statusgrid.reset.mbox.title'),
            i18n.getMsg('statusgrid.reset.mbox.text'),
            function(btn) {
                if (btn === 'yes') {
                    me.doResetStatus(button);
                }
            });
    },

    doResetStatus: function(button) {
        var i18n = Lada.getApplication().bundle;
        button.setDisabled(true);
        var record = button.up('window').down('messungform').getRecord();
        if (!record) {
            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                i18n.getMsg('err.msg.generic.body'));
            return;
        }
        var currentstatus = button.up('statuskombi').currentValue;
        //Set Status to 'Resetted' (8)
        var kombis = Ext.data.StoreManager.get('statuskombi');
        var stufe = currentstatus.statusStufe.id;
        var kombiNdx = kombis.findBy(function(rec, id) {
            return rec.get('statusStufe').id === stufe
                && rec.get('statusWert').id === 8;
        });
        var data = {
            messungsId: record.get('id'),
            mstId: Lada.mst[0], // TODO check if this is the correct one
            datum: new Date(),
            statusKombi: kombis.getAt(kombiNdx).get('id'),
            text: i18n.getMsg('statusgrid.resetText')
        };

        Ext.Ajax.request({
            url: 'lada-server/rest/status',
            jsonData: data,
            method: 'POST',
            success: function(response) {
                var i18n = Lada.getApplication().bundle;
                var json = Ext.JSON.decode(response.responseText);

                if (json) {
                    if (!json.success) {
                        if (json.message) {
                            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title')
                                +' #'+json.message,
                            i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
                    }
                }
                var win = button.up('window');
                win.initData();
                win.down('statusgrid').initData();
                if (response.data) {
                    button.up('statuskombi').setValue(response.data.status);
                }
                try {
                    win.parentWindow.initData();
                    win.parentWindow.down('messunggrid').store.reload();
                } catch (e) {}
            },
            failure: function(response) {
                // TODO sophisticated error handling, with understandable Texts
                var json = Ext.JSON.decode(response.responseText);
                if (json) {
                    if (json.message) {
                        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title')
                            +' #'+json.message,
                        i18n.getMsg(json.message));
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                            i18n.getMsg('err.msg.generic.body'));
                    }
                } else {
                    Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                        i18n.getMsg('err.msg.generic.body'));
                }
            }
        });
    }
});
