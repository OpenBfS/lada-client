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
    extend: 'Lada.controller.form.BaseFormController',
    alias: 'controller.messprogrammform',

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
                validitychange: this.dirtyForm
            },
            'messprogrammform button[action=audit]': {
                click: this.showAuditTrail
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
            'messprogrammform reiprogpunktgruppe combobox': {
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

        var pos = button.up('messprogrammform').up().getPosition();
        pos[0] += 10;
        pos[1] += 10;

        var origRecord = button.up('messprogrammform').getRecord();
        var copy = origRecord.copy(null);
        copy.set('id', null);
        // Associated data are not automatically included in copy
        copy.sampleSpecifs().add(origRecord.sampleSpecifs().getRange());

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
                            win.show();
                            win.initData(copiedRecord);
                            win.setPosition(pos);
                        });
                } else {
                    me.handleServiceFailure(rec, op, 'err.messprogramm.copy');
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
            url: Lada.model.LadaBase.schema.getUrlPrefix()
                + Lada.model.GeolocatMpg.entityName.toLowerCase(),
            params: {
                mpgId: mp.get('id')
            },
            method: 'GET',
            success: function(response) {
                var ortszuordnungArr = Ext.decode(response.responseText);
                fetchedOZ = ortszuordnungArr.length;
                if (fetchedOZ === 0) {
                    me.copyMessmethoden(mp, mpCopy, finishedCallback);
                }

                for (var i = 0; i < ortszuordnungArr.length; i++) {
                    var copy = Ext.create('Lada.model.GeolocatMpg',
                        ortszuordnungArr[i]);
                    copy.set('copyOf', copy.get('id'));
                    copy.set('id', null);
                    copy.set('mpgId', mpCopy.get('id'));
                    copy.phantom = true;
                    copy.save({
                        // eslint-disable-next-line no-loop-func
                        callback: function(rec, op, success) {
                            savedOZ++;
                            if (!success) {
                                var responseObj2 = me.handleServiceFailure(
                                    rec, op, null, true);
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
            },
            failure: function(response, opts) {
                me.handleRequestFailure(
                    response, opts, 'err.ortszuordnung.tile');
            }
        });
    },

    copyMessmethoden: function(mp, mpCopy, finishedCallback) {
        var savedMmt = 0;
        var fetchedMmt = 0;
        var saveErrors = null;
        var i18n = Lada.getApplication().bundle;
        var me = this;

        Ext.Ajax.request({
            url: Lada.model.LadaBase.schema.getUrlPrefix()
                + Lada.model.MpgMmtMp.entityName.toLowerCase(),
            params: {
                mpgId: mp.get('id')
            },
            method: 'GET',
            success: function(response) {
                var mmtArr = Ext.decode(response.responseText);
                fetchedMmt = mmtArr.length;

                if (fetchedMmt === 0) {
                    finishedCallback(mpCopy);
                }

                for (var i = 0; i < mmtArr.length; i++) {
                    var copy = Ext.create('Lada.model.MpgMmtMp',
                        mmtArr[i]);
                    copy.set('copyOf', copy.get('id'));
                    copy.set('id', null);
                    copy.set('mpgId', mpCopy.get('id'));
                    copy.phantom = true;
                    copy.save({
                        // eslint-disable-next-line no-loop-func
                        callback: function(rec, op, success) {
                            savedMmt++;
                            if (!success) {
                                var responseObj2 = me.handleServiceFailure(
                                    rec, op, null, true);
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
            },
            failure: function(response, opts) {
                me.handleRequestFailure(response, opts, 'err.mmt.copy');
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
            if (field.getName() === 'validStartDate') {
                form.down('[name=samplePdStartDate]')
                    .setValue(field.getValue());
            } else {
                form.down('[name=samplePdEndDate]')
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
        var pzwField = formPanel.down('tagfield[name=sampleSpecifs]');
        var pzwStore = Ext.getStore('probenzusaetze');
        var selectedPZW = pzwField.getValue();
        var selectObjects = [];
        Ext.Array.forEach(selectedPZW, function(item) {
            selectObjects.push(pzwStore.getById(item));
        });
        var asocStore = record.sampleSpecifs();
        asocStore.clearData();
        if (selectObjects.length > 0) {
            asocStore.add(selectObjects);
        }

        record.save({
            scope: this,
            success: function(rec) {
                var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                if (parentGrid.length === 1) {
                    parentGrid[0].reload();
                }

                var win = button.up('window');
                if (win.closeRequested) {
                    win.doClose();
                } else {
                    formPanel.setRecord(rec);
                    formPanel.setMessages(
                        rec.get('errors'),
                        rec.get('warnings'),
                        rec.get('notifications'));

                    win.record = rec;
                    win.enableChildren();
                    win.down('button[name=reload]').setDisabled(false);
                }
            },
            failure: this.handleSaveFailure
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

        var field = formPanel.down('tagfield[name=sampleSpecifs]');
        field.value = record.sampleSpecifs().getData().items;
        formPanel.filterProbenZusatzs(record.get('envMediumId'));
    },

    /**
      * The dirtyForm function enables or disables the
      * buttons which are present in the toolbar of the form.
      */
    dirtyForm: function(form) {
        var enableForm = !form.getRecord().get('readonly') && form.isDirty();
        form.owner.down('button[action=save]').setDisabled(
            !enableForm || !form.isValid());
        form.owner.down('button[action=discard]').setDisabled(!enableForm);

        var disableActions = form.getRecord().phantom
            || form.isDirty() || form.getRecord().get('readonly');
        form.owner.up('messprogramm').down(
            'button[action=generateproben]').setDisabled(disableActions);
        form.owner.down('button[action=copy]').setDisabled(disableActions);
    },

    deskriptorSelect: function(field, records) {
        field.up('messprogrammform').down('umwelt[name="envMediumId"]')
            .clearValue();
        var desk = field.up('deskriptor');
        var media = field.up('messprogrammform')
            .down('textfield[name="envDescripDisplay"]');
        var current = media.getValue().split(' ');
        var value;
        if (current.length < 12) {
            for (var i = 0; i <= 12; i++) {
                if (i === 0) {
                    current.push('D:');
                } else if (i === desk.layer + 1) {
                    if (records.get('levVal') < 10) {
                        value = '0' + records.get('levVal');
                    } else {
                        value = records.get('levVal');
                    }
                    current.push(value);
                } else {
                    current.push('00');
                }
            }
        } else {
            if (records.get('levVal') < 10) {
                value = '0' + records.get('levVal');
            } else {
                value = records.get('levVal');
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
            .down('textfield[name="envDescripName"]');

        if ( (desk.layer === 0 ) && (records.get('levVal') === 0) ) {
            media.setValue('');
            mediatext.setValue('');
        } else {
            if ( current[1] === '01') {
                if ( (current[4] !== '00') && (desk.layer === 3) ) {
                    mediatext.setValue(records.data.name);
                } else if ( (current[3] !== '00') && (desk.layer === 2) ) {
                    mediatext.setValue(records.data.name);
                } else if ( (current[2] !== '00') && (desk.layer === 1) ) {
                    mediatext.setValue(records.data.name);
                } else if ( (current[1] !== '00') && (desk.layer === 0 )) {
                    mediatext.setValue(records.data.name);
                }
            }

            if ( current[1] !== '01') {
                if ((current[2] !== '00') && (desk.layer === 1 )) {
                    mediatext.setValue(records.data.name);
                } else if ((current[1] !== '00') && (desk.layer === 0 )) {
                    mediatext.setValue(records.data.name);
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
        if (combo.name !== 'reiAgGrId') {
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
        var reiId = combo.getModelData().reiAgGrId;
        var params = {};
        if (reiId || reiId === 0) {
            params.reiAgGrId = reiId;
        }
        umweltStore.load({params: params});
    },

    /**
     * Called if umweltBereich value has changed. Filters other comboboxes
     * according to the new value.
     */
    umweltChanged: function(combo) {
        // avoids endless loop
        if (combo.name !== 'envMediumId') {
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
        var reiStoreParams = {};
        var umwId = combo.getModelData().envMediumId;
        if (umwId || umwId === 0) {
            reiStoreParams.envMediumId = umwId;
        }
        reiStore.load({params: reiStoreParams});

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
                var defaultMehId = rec.get('unit1');
                var secMehId = rec.get('unit2');
                var params = {};
                if (defaultMehId) {
                    params['measUnitId'] = defaultMehId;
                }
                if (secMehId) {
                    params['secMeasUnitId'] = secMehId;
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
                'reiprogpunktgruppe[name=reiAgGrId]').setHidden(false);
            reiComboContainer.down('ktagruppe[name=nuclFacilGrId]').show();
        } else {
            var reiCombo = reiComboContainer.down(
                'reiprogpunktgruppe[name=reiAgGrId]');
            reiCombo.setHidden(true);
            reiCombo.setValue(null);
            var ktaCombo = reiComboContainer.down(
                'ktagruppe[name=nuclFacilGrId]');
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
    },

    showAuditTrail: function(button) {
        var trail = Ext.create('Lada.view.window.AuditTrail', {
            autoShow: true,
            closeAction: 'destroy',
            type: 'messprogramm',
            objectId: button.up('form').getRecord().get('id')
        });
        button.up('window').addChild(trail);
    }
});
