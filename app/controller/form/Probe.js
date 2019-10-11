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

    dirtyTags: false,

    dirtyProbeForm: false,

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
            'probeform button[action=copy]': {
                click: this.copy
            },
            'probeform button[action=audit]': {
                click: this.showAuditTrail
            },
            'probeform': {
                dirtychange: this.dirtyForm,
                tagdirtychange: this.dirtyTags,
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
     * Copy the probe record of the form. Opens an edit window afterwards.
     */
    copy: function(button) {
        button.up('toolbar[name=generaltoolbar]').setLoading(true);
        var record = button.up('probeform').getRecord();
        var pos = button.up('probeform').up().getPosition();
        pos[0] += 10;
        pos[1] += 10;
        this.copyProbe(record, function(probe) {
            var probeWin = Ext.create(
                'Lada.view.window.ProbeEdit', {
                    record: probe,
                    style: 'z-index: -1;'
                });
            probeWin.initData(probe);
            probeWin.show();
            probeWin.setPosition(pos);
            var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
            if (parentGrid.length === 1) {
                parentGrid[0].reload();
            }
            button.up('toolbar[name=generaltoolbar]').setLoading(false);
        });
    },

    /**
     * Create a copy of the given probe object and open the edit window.
     * @param Probe Probe object to copy
     * @param callback Function to call after probe, messungen and messwerte
     *                 has been copied successfully. Param: copied probe record
     */
    copyProbe: function(probe, callback) {
        var probeId = probe.get('id');
        var i18n = Lada.getApplication().bundle;
        var me = this;
        //Copy probe and reset fields not to be copied
        var fieldsToReset = [
                'id', 'mprId', 'externeProbeId',
                'probeentnahmeBeginn', 'probeentnahmeEnde',
                'solldatumBeginn', 'solldatumEnde', 'hauptprobenNr'];
        var copy = probe.copy(null);
        for (var i = 0; i < fieldsToReset.length; i++) {
            copy.set(fieldsToReset[i], null);
        }
        copy.save({
            callback: function(record, operation, success) {
                if (success) {
                    me.copyOrtszuordnung(probe, copy, callback);
                } else {
                    var responseObj = Ext.decode(op.getResponse().responseText);
                    Ext.Msg.alert(i18n.getMsg('err.probe.copy'), i18n.getMsg(responseObj.message));
                }
            }
        });
    },

    copyOrtszuordnung: function(probe, probeCopy, callback) {
        var me = this;
        var savedOrtszuordnungen = 0;
        var fetchedOrtszuordnungen = 0;
        var saveErrors = null;

        Ext.Ajax.request({
            url: 'lada-server/rest/ortszuordnung',
            params: {
                probeId: probe.get('id')
            },
            method: 'GET',
            success: function(response) {
                var responseObj = Ext.decode(response.responseText);
                //All messung objects as json object
                var ortszuordnungArr = responseObj.data;
                fetchedOrtszuordnungen = ortszuordnungArr.length;
                var ortszuordnungCopyArr = [];
                var ortszuordnungRecArr = [];
                if (fetchedOrtszuordnungen == 0) {
                    me.copyMessungen(probe, probeCopy, callback);
                    return;
                }
                for (var i = 0; i < ortszuordnungArr.length; i++) {
                    var copy = Ext.create('Lada.model.Ortszuordnung', ortszuordnungArr[i]);
                    copy.set('id', null)
                    copy.set('probeId', probeCopy.get('id'));
                    copy.phantom = true;
                    copy.save({
                        callback: function(rec, op, success) {
                            savedOrtszuordnungen++;
                            if (!success) {
                                var responseObj = Ext.decode(op.getResponse().responseText);
                                var errString = i18n.getMsg('err.ortszuordnung.copy.text', rec.get('copyOf'),
                                        i18n.getMsg(responseObj.message));
                                saveErrors = saveErrors ? saveErrors + errString:
                                        errString;
                            }
                            if (savedOrtszuordnungen == fetchedOrtszuordnungen) {
                                if (saveErrors) {
                                    Ext.Msg.alert(i18n.getMsg('err.ortszuordnung.tile'), saveErrors);
                                }
                                me.copyMessungen(probe, probeCopy, callback);
                            }
                        }
                    });
                }
            },
            failure: function(response) {
            }
        });
    },

    /**
     * Create a copy of all messungen connected to a given probe object and
     * attach them to the given probe copy.
     * @param probe The original probe record
     * @param probeCopy The copied probe record
     * @param callback Function to call after the copy process is finished.
     */
    copyMessungen: function(probe, probeCopy, callback) {
        var me = this;
        //Num of copies already saved
        var savedMessungenCopies = 0;
        //Num of messung objects to save
        var fetchedMessungen = 0;
        //Any error strings that occured during the save actions
        var saveErrors = null;
        //Fetch messung objects
        Ext.Ajax.request({
            url: 'lada-server/rest/messung',
            params: {
                probeId: probe.get('id')
            },
            method: 'GET',
            success: function(response) {
                var responseObj = Ext.decode(response.responseText);
                //All messung objects as json object
                var messungArr = responseObj.data;
                fetchedMessungen = messungArr.length;
                //Array of copied models
                var messungCopyArr = [];
                //Array of original records
                var messungRecArr = [];

                if (fetchedMessungen == 0) {
                    callback(probeCopy);
                    return;
                }
                //Reset fields and create records for the copys
                for (var i = 0; i < messungArr.length; i++) {
                    var messung = messungArr[i];
                    var messungRec = Ext.create('Lada.model.Messung', messung);
                    messung.nebenprobenNr = null;
                    messung.fertig = false;
                    messung.geplant = false;
                    messung.messzeitpunkt = null;
                    messung.messdauer = null;
                    var cpy = Ext.create('Lada.model.Messung', messung);
                    cpy.set('probeId', probeCopy.get('id'));
                    cpy.set('copyOfMessungId', messung.id);
                    cpy.set('id', null);
                    cpy.phantom = true;
                    messungCopyArr.push(cpy);
                    messungRecArr.push(messungRec);
                    //Save new models
                    cpy.save({
                        callback: function(rec, op, success) {
                            savedMessungenCopies++;
                            if (!success) {
                                saveErrors = saveErrors ? saveErrors + rec.get('id') + ' failed. ':
                                        '' + rec.get('id') + ' failed. ';
                            }
                            if (savedMessungenCopies == fetchedMessungen) {
                                if (saveErrors) {
                                    Ext.Msg.alert('Messung copy failure!', saveErrors);
                                } else {
                                    me.copyMesswerte(probeCopy, messungRecArr, messungCopyArr, callback);
                                }
                            }
                        }
                    });
                }
            },
            failure: function(response) {

            }
        });
    },

    /**
     * Create copies of all messwert objects connected to the given array
     * of messung records and attach the to their respective copy.
     * @param probeCopy Copied probe record to which the copied messungen and
     *                  messwerte are attached
     * @param messungen Original messungen records to get the original messerte
     *                  from
     * @param messungenCopy Copied messungen to attach the copied messwerte to.
     * @param fininshedCallback Function to call after copying.
     */
    copyMesswerte: function(probeCopy, messungen, messungenCopy, finishedCallback) {
        //Number of messung objects to copy and objects already copied
        var numMessungen = messungen.length;
        messungenFinished = 0;
        currentFinishedMesswerte = 0;
        //Maps containing the numbers of messwert objects to copy and objects already copied;
        var numMesswert = new Ext.util.HashMap();
        var messwertFinished = new Ext.util.HashMap();

        if (numMessungen == 0) {
            finishedCallback(probeCopy);
            return;
        };
        messungsIDNew = new Ext.util.HashMap();
        for (var i = 0; i < messungen.length; i++) {
            messungsIDNew.add(messungen[i].get('copyOfMessungId'), messungen[i].get('id'));
        }
        for (var i = 0; i < messungen.length; i++) {
            var messung = messungen[i];
            var messungsId = messung.get('copyOfMessungId');
            Ext.Ajax.request({
                url: 'lada-server/rest/messwert',
                params: {
                    messungsId: messung.get('copyOfMessungId')
                },
                method: 'GET',
                success: function(response) {
                    var responseObj = Ext.decode(response.responseText);
                    var messwertArr = responseObj.data;
                    fetchedMesswerte = messwertArr.length;
                    var messwertCopyArr = [];
                    var messwertRecArr = [];
                    var messwertRec = Ext.create('Lada.model.Messwert', messwert);
                    var messungsId = messwertArr.length >= 1 ? messwertArr[0].messungsId : null;
                    if (!messungsId) {
                        messungenFinished++;
                        if (messungenFinished == numMessungen && finishedCallback) {
                            finishedCallback(probeCopy);
                        }
                        numMesswert.add(messungsIDNew.get(messungsId), messwertArr.length);
                        //messwertFinished steht die Anzahl der Messwerte, die schon gespeichert wurden
                        messwertFinished.add(messungsIDNew.get(messungsId), 0);
                        return;
                    }
                    if (fetchedMesswerte == 0) {
                            callback(probeCopy);
                        return;
                    }
                    numMesswert.add(messungsIDNew.get(messungsId), messwertArr.length);
                    //messwertFinished steht die Anzahl der Messwerte, die schon gespeichert wurden
                    messwertFinished.add(messungsIDNew.get(messungsId), 0);
                    for (var j = 0; j < messwertArr.length; j++) {
                        var messwert = messwertArr[j];
                        messwert.id = null;
                        messwert.messwert = null;
                        messwert.nwgZuMesswert = null;
                        messwert.messwertNwg = null;
                        messwert.messfehler = null;
                        messwert.messungsId = messungsIDNew.get(messwertArr[j].messungsId);

                        var cpy = Ext.create('Lada.model.Messwert', messwert);
                        cpy.data['id']= null;
                        cpy.phantom = true;
                        messwertCopyArr.push(cpy);
                        messwertRecArr.push(messwertRec);
                        cpy.save({
                            callback: function(rec, op, success) {
                                if (success) {
                                    var currentMessungsIDNew = rec.get('messungsId');
                                    var currentFinishedMesswerte = messwertFinished.get(currentMessungsIDNew);
                                    var currentNumMesswerte = numMesswert.get(currentMessungsIDNew);
                                    currentFinishedMesswerte++;
                                    messwertFinished.add(currentMessungsIDNew, currentFinishedMesswerte);
                                    if(currentFinishedMesswerte == currentNumMesswerte) {
                                        messungenFinished++;
                                    }
                                    if (numMesswert.length == messungenFinished && finishedCallback) {
                                        finishedCallback(probeCopy);
                                    }
                                } else{
                                   //TODO Messwerte liefern immer einen Fehler durch die Konsistenzprüfung
                                    var currentMessungsIDNew = rec.get('messungsId');
                                    var currentFinishedMesswerte = messwertFinished.get(currentMessungsIDNew);
                                    var currentNumMesswerte = numMesswert.get(currentMessungsIDNew);
                                    currentFinishedMesswerte++;
                                    messwertFinished.add(currentMessungsIDNew, currentFinishedMesswerte);
                                    if(currentFinishedMesswerte == currentNumMesswerte) {
                                        messungenFinished++;
                                    }
                                    if (numMesswert.length == messungenFinished && finishedCallback) {
                                        finishedCallback(probeCopy);
                                    }
                               }
                            }
                        });
                    }
                }
            })
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
        //Check if reiprogpunktgruppe widget is contained in a probeform
        var formPanel = combo.up('probeform');
        if (!formPanel) {
            return true;
        }

        var umweltCombo = formPanel.down('umwelt').down('combobox');
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
        //Check if umwelt widget is contained in a probeform

        var formPanel = combo.up('probeform');
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
                    var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
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

        formPanel.down('tagwidget').applyChanges();

        //If form data is read only, exit after saving tags
        if (formPanel.readOnly) {
            //Reload the grid to display tag changes
            Ext.getCmp('dynamicgridid').reload();
            return;
        } else {
            var data = formPanel.getForm().getFieldValues(false);
            var record = formPanel.getForm().getRecord();
            for (var key in data) {
                //Only set existing fields, avoids sending the tag widget
                if (record.get(key) != undefined &&
                            key != formPanel.down('tagwidget').getInputId()) {
                    record.set(key, data[key]);
                }
            }
            if (!record.get('letzteAenderung')) {
                record.set('letzteAenderung', new Date());
            }
            if (record.phantom) {
                record.set('id',null);
            }
            delete record.data[formPanel.down('tagwidget').getInputId()];

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
                            var win = Ext.create('Lada.view.window.ProbeEdit', {
                                record: record
                            });
                            win.initData();
                            win.show();
                            win.setPosition(30);
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
                                var win = Ext.create('Lada.view.window.ProbeEdit', {
                                    record: record
                                });
                                win.setPosition(30);
                                win.show();
                                win.initData();
                            }
                        }
                    }
                }
            });
        }
    },

    /**
      * The discard function resets the Probe form
      * to its original state.
      */
    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().reset();
        formPanel.down('fset[name=entnahmePeriod]').clearMessages();
        formPanel.down('fset[name=sollzeitPeriod]').clearMessages();
        formPanel.down('datetime[name=probeentnahmeBeginn]').clearWarningOrError();
        formPanel.down('datetime[name=probeentnahmeEnde]').clearWarningOrError();
        formPanel.down('tagwidget').reload(false);
        formPanel.down('umwelt').store.clearFilter();
        formPanel.setRecord(formPanel.getForm().getRecord());
    },

    /**
      * The dirtyForm function enables or disables the save and discard
      * button which are present in the toolbar of the form.
      * The Buttons are only active if the content of the form was altered
      * (the form is dirty).
      * The buttons are only deactivated if the tags are not dirty, too.
      * In Additon it calls the disableChildren() function of the window
      * embedding the form. Likewise it calls the embedding windows
      * enableChilren() function
      */
    dirtyForm: function(form, dirty) {
        this.dirtyProbeForm = dirty;
        if (dirty) {
            this.enableButtons(form);
            form.owner.down('button[action=copy]').setDisabled(true);
        } else if (this.dirtyTags == false) {
            this.disableButtons(form);
            if (!form.readOnly) {
                form.owner.down('button[action=copy]').setDisabled(false);
            }
        }
    },

    /**
     * Enables/disabled the save/reset buttons if tags hast been altered.
     * Only disables buttons if form is not dirty, too.
     */
    dirtyTags: function(form, dirty) {
        this.dirtyTags = dirty;
        if (dirty) {
            this.enableButtons(form);
        } else if(this.dirtyProbeForm == false) {
            this.disableButtons(form);
        }
    },

    enableButtons: function(form) {
        form.owner.down('button[action=save]').setDisabled(false);
        form.owner.down('button[action=discard]').setDisabled(false);
        form.owner.up('window').disableChildren();
    },

    disableButtons: function(form) {
        form.owner.down('button[action=save]').setDisabled(true);
        form.owner.down('button[action=discard]').setDisabled(true);
        form.owner.up('window').enableChildren(); // todo this might not be true in all cases
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
        if (w === 0 && e === 0) {
            field.up().clearWarningOrError();
        }
    },

    deskriptorSelect: function(field, records) {
        field.up('probeform').down('umwelt[name="umwId"]').clearValue();
        var desk = field.up('deskriptor');
        var media = field.up('probeform').down('textfield[name="mediaDesk"]');
        var current = media.getValue().split(' ');
        if (current.length < 12) {
            var value;
            for (var i = 0; i < 13; i++) {
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
