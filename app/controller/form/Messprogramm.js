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
            'messprogrammform': {
                dirtychange: this.dirtyForm,
                save: this.saveHeadless
            },
            'messprogrammform messstellelabor combobox': {
                select: this.setNetzbetreiber
            },
            'messprogrammform numfield numberfield': {
                change: this.checkPeriod
            },
            'messprogrammform [name="teilintervallVon"]': {
                change: this.synchronizeSlider
            },
            'messprogrammform [name="teilintervallBis"]': {
                change: this.synchronizeSlider
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
            'messprogrammform container[name="reiComboContainer"] reiprogpunktgruppe combobox': {
                change: this.reiProgpunktGruppeChanged
            },
            'messprogrammform datenbasis combobox': {
                change: this.datenbasisChanged
            }

        });
    },

    /**
     * The Messtellen Store contains ALL Messtellen.
     * Filter the store in this combobox to reduce the choices
     * to the subset which the user is allowed to use.
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
        if (nbId !== null) {
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
     * When the Probenintervall was changed, update the Sliders
     * and the numberfield.
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
     * When the Slider was used,
     * update the Value of the Teilintervallfields
     */
    synchronizeFields: function(slider, newValue, thumb) {
        var formPanel = slider.up('form');
        if (thumb.index === 0) {
            formPanel.getForm()
                .findField('teilintervallVon')
                .setValue(newValue);
        } else if (thumb.index === 1) {
            formPanel.getForm()
                .findField('teilintervallBis')
                .setValue(newValue);
        }

    },

    /**
     * When the IntervallFields were used,
     * update the Slider
     */
    synchronizeSlider: function(field, newValue, oldValue) {
        var formPanel = field.up('form');
        if (field.name === 'teilintervallVon') {
            formPanel.down('probenintervallslider')
                .setValue(0, newValue, false);
        } else if (field.name === 'teilintervallBis') {
            formPanel.down('probenintervallslider')
                .setValue(1, newValue, false);
        }

    },
    /**
     * The save function saves the content of the Messprogramm form.
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
            record.set('id', null);
        }
        record.save({
            success: function(record, response) {
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
                    formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                    if (response.action === 'create' && json.success) {
                        button.up('window').close();
                        var win = Ext.create('Lada.view.window.Messprogramm', {
                            record: record
                        });
                        win.show();
                        win.initData();
                    }
                }
            },
            failure: function(record, response) {
                var i18n = Lada.getApplication().bundle;
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                var rec = formPanel.getForm().getRecord();
                rec.dirty = false;
                formPanel.getForm().loadRecord(record);
                if (response.error) {
                    //TODO: check content of error.status (html error code)
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                        i18n.getMsg('err.msg.generic.body'));
                } else {
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
     * Saves the current form content without manipulating the gui.
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
            record.set('id', null);
        }
        record.save({
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
                var rec = formPanel.getForm().getRecord();
                rec.dirty = false;
                formPanel.getForm().loadRecord(record);
                if (response.error) {
                    //TODO: check content of error.status (html error code)
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                        i18n.getMsg('err.msg.generic.body'));
                } else {
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
      * The discard function resets the form
      * to its original state.
      */
    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().reset();
        formPanel.getForm().owner.populateIntervall(
            formPanel.getForm().getRecord());
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
        if (form.getRecord().phantom || dirty) {
            form.owner.up('messprogramm').down(
                'button[action=generateproben]').setDisabled(true);
        } else {
            form.owner.up('messprogramm').down(
                'button[action=generateproben]').setDisabled(false);
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
        var desk = field.up('deskriptor');
        var media = field.up('messprogrammform').down('textfield[name="mediaDesk"]');
        var current = media.getValue().split(' ');
        if (current.length < 12) {
            var value;
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

        if (current[0].length === 0) {
            current.splice(0,1);
        }
        var mediatext = field.up('messprogrammform').down('textfield[name="media"]');

        if ( (desk.layer === 0 ) && (records.get('sn') === 0) ) {
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
     * Called if reiProgpunktGruppe value has changed. Filters Umweltbereich values according to the new value
     */
    reiProgpunktGruppeChanged: function(combo, newVal, oldVal, opts) {
        // avoids endless loop
        if (combo.name !== 'reiProgpunktGrpId') {
            return true;
        }
        //Check if reiprogpunktgruppe widget is contained in a messprogrammform
        var formPanel = combo.up('messprogrammform');
        if (!formPanel) {
            return true;
        }

        var umweltCombo = formPanel.down('fieldset[title=Medium]').down('umwelt').down('combobox');
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
     * Called if umweltBereich value has changed. filters reiProgpunktgruppe values according to the new value.
     */
    umweltChanged: function(combo, newVal, oldVal, opts) {
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
    },

    /* Called if Datenbasis value changed. Changes visibility of REI specific containers if Datenbasis is REI
    */
    datenbasisChanged: function(combo, newVal, oldVal, opts) {
        var datenbasis = combo.getRawValue();
        var reiComboContainer = combo.up('messprogrammform').down('container[name=reiComboContainer]');
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
    }
});
