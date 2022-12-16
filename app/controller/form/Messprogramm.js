/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A Controller for a Messprogramm form
 */
Ext.define('Lada.controller.form.Messprogramm', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller
     */
    init: function() {
        this.control({
            'messprogrammform button[action=save]': {
                click: this.save
            },
            'messprogrammform button[action=discard]': {
                click: this.discard
            },
            'messprogrammform button[action=copy]': {
                click: this.copy
            },
            'messprogrammform': {
                dirtychange: this.dirtyForm,
                save: this.saveHeadless
            },
            'messprogrammform numfield numberfield': {
                change: this.checkPeriod
            },
            'messprogrammform probenintervall combobox': {
                change: this.updateIntervalls
            },
            'messprogrammform dayofyear [hidden]': {
                change: this.alignSubIntervall
            },
            'messprogrammform panel[xtype="deskriptor"] combobox': {
                select: this.deskriptorSelect
            },
            'messprogrammform umwelt combobox': {
                change: this.umweltChanged
            },
            // eslint-disable-next-line max-len
            'messprogrammform container[name="reiComboContainer"] reiprogpunktgruppe combobox': {
                change: this.reiProgpunktGruppeChanged
            },
            'messprogrammform datenbasis combobox': {
                change: this.datenbasisChanged
            }

        });
    },

    /**
     * Start to copy the content of the messprogramm form
     */
    copy: function(button) {
        var me = this;
        var origRecord = button.up('messprogrammform').getRecord();
        var pos = button.up('messprogrammform').up().getPosition();
        pos[0] += 10;
        pos[1] += 10;

        var copy = origRecord.copy(null);
        copy.set('id', null);
        copy.save({
            callback: function(rec, op, success) {
                if (success) {
                    me.copyOrtszuordnung(origRecord, copy,
                        function(copiedRecord) {
                            var win = Ext.create(
                                'Lada.view.window.Messprogramm', {
                                    record: copiedRecord
                                }
                            );
                            win.initData(copiedRecord);
                            win.show();
                            win.setPosition(pos);
                        });
                } else {
                    var i18n = Lada.getApplication().bundle;
                    Ext.Msg.alert(i18n.getMsg('err.messprogramm.copy'),
                        i18n.getMsg('err.msg.generic.body'));
                }
            }
        });
    },

    copyOrtszuordnung: function(mp, mpCopy, finishedCallback) {
        var me = this;
        var savedOZ = 0;
        var fetchedOZ = 0;
        var saveErrors = null;
        var i18n = Lada.getApplication().bundle;

        Ext.Ajax.request({
            url: 'lada-server/rest/ortszuordnungmp',
            params: {
                messprogrammId: mp.get('id')
            },
            method: 'GET',
            success: function(response) {
                var responseObj = Ext.decode(response.responseText);
                //All messung objects as json object
                var ortszuordnungArr = responseObj.data;
                fetchedOZ = ortszuordnungArr.length;
                if (fetchedOZ === 0) {
                    me.copyMessmethoden(mp, mpCopy, finishedCallback);
                }

                for (var i = 0; i < ortszuordnungArr.length; i++) {
                    var copy = Ext.create('Lada.model.OrtszuordnungMp',
                        ortszuordnungArr[i]);
                    copy.set('copyOf', copy.get('id'));
                    copy.set('id', null);
                    copy.set('messprogrammId', mpCopy.get('id'));
                    copy.phantom = true;
                    copy.save({
                        // eslint-disable-next-line no-loop-func
                        callback: function(rec, op, success) {
                            savedOZ++;
                            if (!success) {
                                var responseObj2 = Ext.decode(
                                    op.getResponse().responseText);
                                var errString = i18n.getMsg(
                                    'err.ortszuordnung.copy.text',
                                    rec.get('copyOf'),
                                    i18n.getMsg(responseObj2.message));
                                saveErrors = saveErrors ?
                                    saveErrors + errString :
                                    errString;
                            }
                            if (savedOZ === fetchedOZ) {
                                if (saveErrors) {
                                    Ext.Msg.alert(
                                        i18n.getMsg('err.ortszuordnung.tile'),
                                        saveErrors);
                                }
                                me.copyMessmethoden(
                                    mp, mpCopy, finishedCallback
                                );
                            }
                        }
                    });
                }
            }
        });
    },

    copyMessmethoden: function(mp, mpCopy, finishedCallback) {
        var savedMmt = 0;
        var fetchedMmt = 0;
        var saveErrors = null;
        var i18n = Lada.getApplication().bundle;

        Ext.Ajax.request({
            url: 'lada-server/rest/messprogrammmmt',
            params: {
                messprogrammId: mp.get('id')
            },
            method: 'GET',
            success: function(response) {
                var responseObj = Ext.decode(response.responseText);
                //All messung objects as json object
                var mmtArr = responseObj.data;
                fetchedMmt = mmtArr.length;

                if (fetchedMmt === 0) {
                    finishedCallback(mpCopy);
                }

                for (var i = 0; i < mmtArr.length; i++) {
                    var copy = Ext.create('Lada.model.MmtMessprogramm',
                        mmtArr[i]);
                    copy.set('copyOf', copy.get('id'));
                    copy.set('id', null);
                    copy.set('messprogrammId', mpCopy.get('id'));
                    copy.phantom = true;
                    copy.save({
                        // eslint-disable-next-line no-loop-func
                        callback: function(rec, op, success) {
                            savedMmt++;
                            if (!success) {
                                var responseObj2 = Ext.decode(
                                    op.getResponse().responseText);
                                var errString = i18n.getMsg(
                                    'err.mmt.copy.text', rec.get('copyOf'),
                                    i18n.getMsg(responseObj2.message));
                                saveErrors = saveErrors ?
                                    saveErrors + errString :
                                    errString;
                            }
                            if (savedMmt === fetchedMmt) {
                                if (saveErrors) {
                                    Ext.Msg.alert(i18n.getMsg('err.mmt.tile'),
                                        saveErrors);
                                }
                                finishedCallback(mpCopy);
                            }
                        }
                    });
                }
            }
        });
    },

    /**
     * When the Probenintervall was changed, update the numberfield.
     */
    updateIntervalls: function(field, newval, oldval) {
        if (newval === oldval) {
            return false;
        }
        var form = field.up('messprogrammform');
        var record = form.getRecord();
        form.populateIntervall(record, field.getValue());
    },

    /**
     * When the validity period was changed, align the subintervall
     * in case of yearly intervall.
     */
    alignSubIntervall: function(field) {
        var form = field.up('messprogrammform');
        var intervall = form.down('probenintervall').down('combobox')
            .getValue();
        if (intervall === 'J') {
            if (field.getName() === 'gueltigVon') {
                form.down('[name=teilintervallVon]')
                    .setValue(field.getValue());
            } else {
                form.down('[name=teilintervallBis]')
                    .setValue(field.getValue());
            }
        }
    },

    /**
     * The save function saves the content of the Messprogramm form.
     * On success it will reload the Store,
     * on failure, it will display an Errormessage
     */
    save: function(button) {
        var formPanel = button.up('form');
        var record = formPanel.getForm().getRecord();

        // Update record with values changed in the form
        record.set(formPanel.getForm().getFieldValues(true));
        if (record.phantom) {
            record.set('id', null);
        }

        //Update selected ProbeZusatz objects
        var pzwField = formPanel.down('tagfield[name=probenZusatzs]');
        var pzwStore = Ext.getStore('probenzusaetze');
        var selectedPZW = pzwField.getValue();
        var selectObjects = [];
        Ext.Array.forEach(selectedPZW, function(item) {
            selectObjects.push(pzwStore.getById(item));
        });
        var asocStore = record.probenZusatzs();
        asocStore.clearData();
        if (selectObjects.length > 0) {
            asocStore.add(selectObjects);
        }
        record.save({
            success: function(rec, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                    var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                    if (parentGrid.length === 1) {
                        parentGrid[0].reload();
                    }
                    formPanel.clearMessages();
                    formPanel.setRecord(rec);
                    formPanel.setMediaDesk(rec);
                    formPanel.setMessages(json.errors, json.warnings);
                    var win = button.up('window');
                    win.record = rec;
                    win.enableChildren();
                }
            },
            failure: function(newRecord, response) {
                var i18n = Lada.getApplication().bundle;
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                var rec = formPanel.getForm().getRecord();
                rec.dirty = false;
                formPanel.getForm().loadRecord(newRecord);
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
     * Saves the current form content without manipulating the gui.
     */
    saveHeadless: function(panel) {
        var formPanel = panel;
        var data = formPanel.getForm().getFieldValues(false);
        var record = formPanel.getForm().getRecord();
        for (var key in data) {
            record.set(key, data[key]);
        }
        if (record.phantom) {
            record.set('id', null);
        }
        record.save({
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
                var rec = formPanel.getForm().getRecord();
                rec.dirty = false;
                formPanel.getForm().loadRecord(rec);
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
                }
            }
        });
    },


    /**
      * The discard function resets the form
      * to its original state.
      */
    discard: function(button) {
        var formPanel = button.up('form');
        var form = formPanel.getForm();
        form.reset();
        formPanel.down('messstellelabor').setMessstelleLabor();

        var record = form.getRecord();
        formPanel.getForm().owner.populateIntervall(record);
        formPanel.setMediaDesk(record);

        var field = formPanel.down('tagfield[name=probenZusatzs]');
        field.value = record.probenZusatzs().getData().items;
        formPanel.filterProbenZusatzs(record.get('umwId'));
    },

    /**
      * The dirtyForm function enables or disables the save and discard
      * button which are present in the toolbar of the form.
      * The Buttons are only active if the content of the form was altered
      * (the form is dirty).
      */
    dirtyForm: function(form, dirty) {
        if (!form.getRecord().get('readonly') && dirty) {
            form.owner.down('button[action=save]').setDisabled(false);
            form.owner.down('button[action=discard]').setDisabled(false);
        } else {
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=discard]').setDisabled(true);
        }
        if (form.getRecord().phantom || dirty ||
            form.getRecord().get('readonly') === true) {
            form.owner.up('messprogramm').down(
                'button[action=generateproben]').setDisabled(true);
            form.owner.down('button[action=copy]').setDisabled(true);
        } else {
            form.owner.up('messprogramm').down(
                'button[action=generateproben]').setDisabled(false);
            form.owner.down('button[action=copy]').setDisabled(false);
        }
    },

    /**
     * checkPeriod() is called when a fields defining an intervall
     * were modified
     * The function validates if the start is smaller than end.
     */
    checkPeriod: function(field) {
        // This field might be a field within a Period.
        // Search for Partner field (period: end/start) and validate
        // End Before Start validation
        if (field.period) {
            var partners = new Array();
            partners[0] = field.up('fieldset')
                .down('numberfield[period=start]').getValue();
            partners[1] = field.up('fieldset')
                .down('numberfield[period=end]').getValue();
            if (partners[0] && partners[1] && partners[0] > partners [1]) {
                var msg = Lada.getApplication().bundle.getMsg('662');
                field.up('fieldset').showWarningOrError(false, '', true, msg);
            } else {
                field.up('fieldset').clearMessages();
            }
        }
    },

    deskriptorSelect: function(field, records) {
        field.up('messprogrammform').down('umwelt[name="umwId"]').clearValue();
        var desk = field.up('deskriptor');
        var media = field.up('messprogrammform')
            .down('textfield[name="mediaDesk"]');
        var current = media.getValue().split(' ');
        var value;
        if (current.length < 12) {
            for (var i = 0; i <= 12; i++) {
                if (i === 0) {
                    current.push('D:');
                } else if (i === desk.layer + 1) {
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
            if (records.get('sn') < 10) {
                value = '0' + records.get('sn');
            } else {
                value = records.get('sn');
            }
            current[desk.layer + 1] = value;
            if (desk.layer < 2) {
                for (var j = desk.layer + 2; j < 12; j++) {
                    current[j] = '00';
                }
                this.clearChildDesk(desk);
            } else if (desk.layer === 2 && current[1] === '01') {
                current[4] = '00';
                desk.up('fieldset').down('deskriptor[layer=3]').clearValue();
            }
        }
        media.setValue(current.join(' ').trim());

        if (current[0].length === 0) {
            current.splice(0, 1);
        }
        var mediatext = field.up('messprogrammform')
            .down('textfield[name="media"]');

        if ( (desk.layer === 0 ) && (records.get('sn') === 0) ) {
            media.setValue('');
            mediatext.setValue('');
        } else {
            if ( current[1] === '01') {
                if ( (current[4] !== '00') && (desk.layer === 3) ) {
                    mediatext.setValue(records.data.beschreibung);
                } else if ( (current[3] !== '00') && (desk.layer === 2) ) {
                    mediatext.setValue(records.data.beschreibung);
                } else if ( (current[2] !== '00') && (desk.layer === 1) ) {
                    mediatext.setValue(records.data.beschreibung);
                } else if ( (current[1] !== '00') && (desk.layer === 0 )) {
                    mediatext.setValue(records.data.beschreibung);
                }
            }

            if ( current[1] !== '01') {
                if ((current[2] !== '00') && (desk.layer === 1 )) {
                    mediatext.setValue(records.data.beschreibung);
                } else if ((current[1] !== '00') && (desk.layer === 0 )) {
                    mediatext.setValue(records.data.beschreibung);
                }
            }
        }
    },

    clearChildDesk: function(field) {
        var allS = field.up('fieldset').items.items;
        for (var i = field.layer + 1; i < 12; i++) {
            allS[i].clearValue();
        }
    },

    /**
     * Called if reiProgpunktGruppe value has changed. Filters Umweltbereich
     * values according to the new value
     */
    reiProgpunktGruppeChanged: function(combo) {
        // avoids endless loop
        if (combo.name !== 'reiProgpunktGrpId') {
            return true;
        }
        //Check if reiprogpunktgruppe widget is contained in a messprogrammform
        var formPanel = combo.up('messprogrammform');
        if (!formPanel) {
            return true;
        }

        var umweltCombo = formPanel.down('fieldset[title=Medium]')
            .down('umwelt')
            .down('combobox');
        if (!umweltCombo) {
            return true;
        }
        var umweltStore = umweltCombo.store;
        var reiId = combo.getModelData().reiProgpunktGrpId;
        umweltStore.proxy.extraParams = {};
        if (reiId || reiId === 0) {
            umweltStore.proxy.extraParams.reiprogpunktgruppe = reiId;
        }
        umweltStore.load();
    },

    /**
     * Called if umweltBereich value has changed. filters reiProgpunktgruppe
     * values according to the new value.
     */
    umweltChanged: function(combo) {
        // avoids endless loop
        if (combo.name !== 'umwId') {
            return true;
        }
        //Check if umwelt widget is contained in a messprogrammform
        var formPanel = combo.up('messprogrammform');
        if (!formPanel) {
            return true;
        }

        var reiCombo = formPanel.down('reiprogpunktgruppe').down('combobox');
        if (!reiCombo) {
            return true;
        }
        var reiStore = reiCombo.store;
        reiStore.proxy.extraParams = {};
        var umwId = combo.getModelData().umwId;
        if (umwId || umwId === 0) {
            reiStore.proxy.extraParams.umwelt = umwId;
        }
        reiStore.load();

        var masseinheitCombo = formPanel.down('messeinheit').down('combobox');
        var masseinheitStore = masseinheitCombo.store;
        if (umwId === null) {
            masseinheitCombo.clearValue();
            masseinheitStore.load();
            return true;
        }

        var umwStore = formPanel.down('umwelt').down('combobox').store;
        umwStore.getModel().load(umwId, {
            success: function(rec) {
                var defaultMehId = rec.get('mehId');
                var secMehId = rec.get('secMehId');
                var params = {};
                if (defaultMehId) {
                    params['mehId'] = defaultMehId;
                }
                if (secMehId) {
                    params['secMehId'] = secMehId;
                }
                masseinheitStore.load({
                    scope: this,
                    params: params
                });
            }
        });

        //Filter ProbenZusatz tagfield
        formPanel.filterProbenZusatzs(umwId);
    },

    /* Called if Datenbasis value changed. Changes visibility of REI specific
    * containers if Datenbasis is REI
    */
    datenbasisChanged: function(combo) {
        var datenbasis = combo.getRawValue();
        var reiComboContainer = combo.up('messprogrammform')
            .down('container[name=reiComboContainer]');
        if ( datenbasis === 'REI-E' || datenbasis === 'REI-I') {
            reiComboContainer.down(
                'reiprogpunktgruppe[name=reiProgpunktGrpId]').setHidden(false);
            reiComboContainer.down('ktagruppe[name=ktaGruppeId]').show();
        } else {
            var reiCombo = reiComboContainer.down(
                'reiprogpunktgruppe[name=reiProgpunktGrpId]');
            reiCombo.setHidden(true);
            reiCombo.setValue(null);
            var ktaCombo = reiComboContainer.down(
                'ktagruppe[name=ktaGruppeId]');
            ktaCombo.hide();
            ktaCombo.setValue(null);
        }
    },

    reloadMPr: function(button) {
        var form = button.up('window').down('messprogrammform');
        var callback = function() {
            button.up('messprogramm').initData();
        };
        if (form.isDirty()) {
            var i18n = Lada.getApplication().bundle;
            Ext.MessageBox.alert(
                i18n.getMsg('reloadRecord', i18n.getMsg('messprogramm')),
                i18n.getMsg('confirmation.discardchanges'),
                callback);
        } else {
            callback();
        }
    }
});
