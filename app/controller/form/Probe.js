/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A Controller for a Probe form
 */
Ext.define('Lada.controller.form.Probe', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.window.AuditTrail'
    ],

    /**
     * Initialize the Controller
     * It has 4 listeners
     */
    init: function() {
        this.control({
            'probeform button[action=save]': {
                click: this.save
            },
            'probeform button[action=discard]': {
                click: this.discard
            },
            'probeform button[action=audit]': {
                click: this.showAuditTrail
            },
            'probeform': {
                dirtychange: this.dirtyForm,
                save: this.saveHeadless
            },
            'probeform umwelt combobox': {
                change: this.umweltChanged
            },
            'probeform datenbasis combobox': {
               change: this.datenbasisChanged
            },
            'probeform messstellelabor combobox': {
                select: this.setNetzbetreiber
            },
            'probeform container[name="reiComboContainer"] reiprogpunktgruppe combobox': {
                change: this.reiProgpunktGruppeChanged
            },
            'probeform [xtype="datetime"] field': {
                blur: this.checkDate
            },
            'probeform panel[xtype="deskriptor"] combobox': {
                select: this.deskriptorSelect
            }
        });
    },

    

    /**
     * Called if reiProgpunktGruppe value has changed. Filters Umweltbereich values according to the new value
     */
    reiProgpunktGruppeChanged: function(combo, newVal, oldVal, opts) {
        //Check if reiprogpunktgruppe widget is contained in a probeform
        var formPanel = combo.up().up().up().up().up().up('probeform');
        if (!formPanel) {
            return;
        }

        var umweltCombo = formPanel.down('fieldset[title=Medium]').down('umwelt').down('combobox');
        var umweltStore = umweltCombo.store;
        var reiId = combo.getValue();
        if (newVal == '' || newVal == null) {
            umweltStore.clearListeners();
            umweltStore.proxy.extraParams = {};
            umweltStore.load();
        } else {
            umwId = umweltCombo.getModelData().umwId;
            umweltStore.setExtraParams({'reiprogpunktgruppe': reiId}, umwId, umweltCombo, combo);
        }
    },

    /**
     * Called if umweltBereich value has changed. filters reiProgpunktgruppe values according to the new value.
     */
    umweltChanged: function(combo, newVal, oldVal, opts) {
        //Check if umwelt widget is contained in a probeform
        var formPanel = combo.up().up().up().up().up().up('probeform');
        if (!formPanel) {
            return;
        }

        var reiCombo = formPanel.down('fieldset[title=Allgemein]').down('container[name=reiComboContainer]')
                .down('reiprogpunktgruppe').down('combobox');
        if (!reiCombo.isVisible) {
            return;
        }
        var reiStore = reiCombo.store;
        var umwId = combo.getModelData().umwId;
        var progPunktId = reiCombo.getModelData().reiProgpunktGrpId;
        if (newVal == null || newVal === '') {
            reiStore.clearListeners();
            reiStore.proxy.extraParams = {};
            reiStore.load();
        } else {
            reiStore.setExtraParams({'umwelt': umwId}, progPunktId, reiCombo, combo);
        }
    },

    /**
     * Called if Datenbasis value changed. Changes visibility of REI specific containers if Datenbasis is REI
     */
    datenbasisChanged: function(combo, newVal, oldVal, opts) {
        var datenbasis = combo.getRawValue();
        var reiComboContainer = combo.up().up().up().down('container[name=reiComboContainer]');
        if ( datenbasis === 'REI-E' || datenbasis === 'REI-I') {
            reiComboContainer.down('reiprogpunktgruppe[name=reiProgpunktGrpId]').setHidden(false);
            reiComboContainer.down('ktagruppe[name=ktaGruppeId]').show();
        } else {
            var reiCombo = reiComboContainer.down('reiprogpunktgruppe[name=reiProgpunktGrpId]');
            reiCombo.setHidden(true);
            reiCombo.setValue(null);
            var ktaCombo = reiComboContainer.down('ktagruppe[name=ktaGruppeId]');
            ktaCombo.hide();
            ktaCombo.setValue(null);
        }
    },


    /**
     * The Messtellen Store contains ALL Messtellen.
     * Filter the store in this combobox to reduce the choices
     * to the subset which the user is allowed to use.
     *
     * The app.js also creates a messstellenFiltered store,
     * which contains this selection. Maybe this can be used here in future
     * TODO
     */
    filter: function(field) {
        var fil = Ext.create('Ext.util.Filter', {
            filterFn: function(item) {
                if (Ext.Array.contains(Lada.mst, item.get('id'))) {
                    return true;
                }
                return false;
            }
        });
        field.getStore().filter(fil);
    },

    /**
     * When a Messtelle is selected, modify the Netzbetreiber
     * according to the Messstelle
     */
    setNetzbetreiber: function(combo, records) {
        var netzbetreiber = combo.up().up('form')
            .down('netzbetreiber').down('combobox');
        var nbId = records.get('netzbetreiberId');
        if (nbId != null) {
            //select the NB in the NB-Combobox
            netzbetreiber.select(nbId);
        }
        var mst = records.get('messStelle');
        var labor = records.get('laborMst');
        combo.up('fieldset').down('messstelle[name=mstId]').setValue(mst);
        combo.up('fieldset').down('messstelle[name=laborMstId]').setValue(labor);
        combo.up('fieldset').down('messprogrammland[name=mplId]').setValue();

    },

    /**
     * Saves the current form without manipulating the GUI.
     */
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
            record.set('id',null);
        }
        record.save({
            success: function(record, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    var parentGrid = Ext.ComponentQuery.query('probelistgrid');
                    if (parentGrid.length == 1) {
                        parentGrid[0].store.reload();
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

    /**
     * The save function saves the content of the Messung form.
     * On success it will reload the Store,
     * on failure, it will display an Errormessage
     */
    save: function(button) {
        var formPanel = button.up('form');
        var data = formPanel.getForm().getFieldValues(false);
        var record = formPanel.getForm().getRecord();
        for (var key in data) {
            record.set(key, data[key]);
        }
        if (!record.get('letzteAenderung')) {
            record.set('letzteAenderung', new Date());
        }
        if (record.phantom) {
            record.set('id',null);
        }
        record.save({
            success: function(record, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                    var parentGrid = Ext.ComponentQuery.query('probelistgrid');
                    if (parentGrid.length == 1) {
                        parentGrid[0].store.reload();
                    }
                    formPanel.clearMessages();
                    formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                    if (response.action === 'create' && json.success) {
                        button.up('window').close();
                        var win = Ext.create('Lada.view.window.ProbeEdit', {
                            record: record
                        });
                        win.show();
                        win.initData();
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
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                    var rec = formPanel.getForm().getRecord();
                    rec.dirty = false;
                    formPanel.getForm().loadRecord(record);
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
            }
        });
    },

    /**
      * The discard function resets the Probe form
      * to its original state.
      */
    discard: function(button) {
        var formPanel = button.up('form');

        formPanel.down('fset[name=entnahmePeriod]').clearMessages();
        formPanel.down('fset[name=sollzeitPeriod]').clearMessages();
        formPanel.down('datetime[name=probeentnahmeBeginn]').clearWarningOrError();
        formPanel.down('datetime[name=probeentnahmeEnde]').clearWarningOrError();

        formPanel.down('umwelt').store.clearFilter();
        formPanel.setRecord(formPanel.getForm().getRecord());
    },

    /**
      * The dirtyForm function enables or disables the save and discard
      * button which are present in the toolbar of the form.
      * The Buttons are only active if the content of the form was altered
      * (the form is dirty).
      * In Additon it calls the disableChildren() function of the window
      * embedding the form. Likewise it calls the embedding windows
      * enableChilren() function
      */
    dirtyForm: function(form, dirty) {
        if (dirty) {
            form.owner.down('button[action=save]').setDisabled(false);
            form.owner.down('button[action=discard]').setDisabled(false);
            form.owner.up('window').disableChildren();
        } else {
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=discard]').setDisabled(true);
            form.owner.up('window').enableChildren(); // todo this might not be true in all cases
        }
    },

    /**
     * checkDate() is called when a xtype=datetime field was modified
     * It checks for two things:
     *  - Is the date in the future
     *  - Does the date belong to a time period and the end is before start
     * In both cases it adds a warning to the field which was checked.
     */
    checkDate: function(field) {
        var now = Date.now();
        var w = 0; //amount of warnings
        var e = 0; //errors
        var emsg = '';
        var wmsg = '';

        if (field.getValue() > now) {
            wmsg += Lada.getApplication().bundle.getMsg('661');
            w++;
        }
        // This field might be a field within a DateTime-Period.
        // Search for Partner field (period: end/start) and validate
        // End Before Start validation
        if (field.period) {
            var partners = new Array();
            partners[0] = field.up('fieldset').down('datetime[period=start]').down().getValue();
            partners[1] = field.up('fieldset').down('datetime[period=end]').down().getValue();
            if (partners[0] && partners[1] && partners[0] > partners [1]) {
                var msg = Lada.getApplication().bundle.getMsg('662');
                field.up('fieldset').showWarningOrError(true, msg, false, '');
            } else {
                field.up('fieldset').clearMessages();
            }
        }

        if (w) {
            field.up().showWarnings(wmsg);
        }
        if (e) {
            field.up().showErrors(emsg);
        }

        // Clear Warnings or Errors if none Are Present
        if (w == 0 && e == 0) {
            field.up().clearWarningOrError();
        }
    },

    deskriptorSelect: function(field, records) {
        var desk = field.up('deskriptor');
        var media = field.up('probeform').down('textfield[name="mediaDesk"]');
        var current = media.getValue().split(' ');
        if (current.length < 12) {
            var value;
            for (var i = 0; i < 13; i++) {
                if (i === 0) {
                    current.push('D:');
                } else if (i === desk.layer + 1) {
                    var value;
                    if (records.get('sn') < 10) {
                        value = '0' + records.get('sn');
                    } else {
                        value = records.get('sn');
                    }
                    current.push(value);
                } else {
                    current.push('00');
                }
            }
        } else {
            var value;
            if (records.get('sn') < 10) {
                value = '0' + records.get('sn');
            } else {
                value = records.get('sn');
            }
            current[desk.layer + 1] = value;
            if (desk.layer < 2) {
                for (var i = desk.layer + 2; i < 12; i++) {
                    current[i] = '00';
                }
                this.clearChildDesk(desk);
            } else if (desk.layer === 2 && current[1] === '01') {
                current[4] = '00';
                desk.up('fieldset').down('deskriptor[layer=3]').clearValue();
            }
        }
        media.setValue(current.join(' ').trim());

        if (current[0].length == 0) {
            current.splice(0,1);
        }
        var mediatext = field.up('probeform').down('textfield[name="media"]');

        if ( (desk.layer === 0 ) && (records.get('sn') === 0) ) {
            mediatext.setValue('');
        } else {
            if ( current[1] === '01') {
                if ( (current[4] !== '00') && (desk.layer === 3) ) {
                    mediatext.setValue(records.get('beschreibung'));
                } else if ( (current[3] !== '00') && (desk.layer === 2) ) {
                    mediatext.setValue(records.get('beschreibung'));
                } else if ( (current[2] !== '00') && (desk.layer === 1) ) {
                    mediatext.setValue(records.get('beschreibung'));
                } else if ( (current[1] !== '00') && (desk.layer === 0 )) {
                    mediatext.setValue(records.get('beschreibung'));
                }
            }

            if ( current[1] !== '01') {
                if ((current[2] !== '00') && (desk.layer === 1 )) {
                    mediatext.setValue(records.get('beschreibung'));
                } else if ((current[1] !== '00') && (desk.layer === 0 )) {
                    mediatext.setValue(records.get('beschreibung'));
                }
            }
        }
    },

    clearChildDesk: function(field) {
        var allS = field.up('fieldset').items.items;
        for (var i = field.layer + 1; i < 12; i++) {
            allS[i].down('combobox').clearValue();
        }
    },

    showAuditTrail: function(button) {
        Ext.create('Lada.view.window.AuditTrail', {
            autoShow: true,
            closeAction: 'destroy',
            type: 'probe',
            objectId: button.up('form').recordId
        });
    }
});
