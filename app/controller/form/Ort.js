/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * This is a controller for an Ort Form
 */
Ext.define('Lada.controller.form.Ort', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller
     */
    init: function() {
        this.control({
            'ortform button[action=save]': {
                click: this.save
            },
            'ortform button[action=revert]': {
                click: this.discard
            },
            'ortform button[action=copy]': {
                click: this.copyOrt
            },
            'ortform staat combobox': {
                change: this.checkCommitEnabled
            },
            'ortform verwaltungseinheit combobox': {
                change: this.checkCommitEnabled
            },
            'ortform netzbetreiber combobox': {
                change: this.checkCommitEnabled
            },
            'ortform koordinatenart combobox': {
                change: this.checkCommitEnabled
            },
            'ortform numfield [name=koordXExtern]': {
                change: this.checkCommitEnabled
            },
            'ortform numfield [name=koordYExtern]': {
                change: this.checkCommitEnabled
            },
            'ortform': {
                validitychange: this.checkCommitEnabled,
                dirtychange: this.handleDirtyChange
            }
        });
    },

    copyOrt: function(button) {
        var record = button.up('ortform').getForm().getRecord();
        var copy = record.copy(null);
        record.set('ortId', null);
        var win = Ext.create('Lada.view.window.Ort',{
            record: copy,
            mode: 'copy',
            original: record
        });
        var pos = button.up('ortform').up().getPosition();
        pos[0] += 10;
        pos[1] += 10;
        win.setPosition(pos);
        win.show();
    },

    save: function(button) {
        var formpanel = button.up('ortform');
        var form = formpanel.getForm();
        var record = form.getRecord();
        var data = form.getFieldValues(false);
        for (var key in data) {
            record.set(key, data[key]);
        }
        record.set('netzbetreiberId',
            formpanel.down('netzbetreiber').getValue()[0]);

        if (record.phantom) {
            record.set('id', null);
        }
        record.save({
            success: function(newrecord, response) {
                form.loadRecord(newrecord);
                formpanel.down('verwaltungseinheit').store.clearFilter();
                formpanel.down('staat').store.clearFilter();
                if (formpanel.up('window').setOzOnComplete === true ){
                    var ozf = Ext.ComponentQuery.query('ortszuordnungform')[0];
                    if (ozf){
                        ozf.setOrt(null, newrecord);
                    }
                }
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    formpanel.clearMessages();
                    formpanel.setMessages(json.errors, json.warnings);
                }
                var dynamicgrid = Ext.getCmp('dynamicgridid');
                if (dynamicgrid) {
                    dynamicgrid.reload();
                }
                var ozw = formpanel.up('panel').parentWindow;
                if (ozw && ozw.down('tabpanel')) {
                    var ortgrid= ozw.down('tabpanel').down('ortstammdatengrid');
                    if (ortgrid) {
                        if (ortgrid.store.storeId === 'ext-empty-store') {
                            ortgrid.store = Ext.create('Lada.store.Orte');
                        }
                        ortgrid.store.add(newrecord);
                        ortgrid.store.reload();
                    }
                }
                formpanel.down('button[action=revert]').setDisabled(true);
                formpanel.down('button[action=save]').setDisabled(true);
                formpanel.up('window').setMode('edit');
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
                            +' #'+ json.message,
                            i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
                        formpanel.clearMessages();
                        formpanel.setMessages(json.errors, json.warnings);
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                            i18n.getMsg('err.msg.response.body'));
                    }
                }
            }
        });
    },
    handleDirtyChange: function(callingEl, dirty) {
        var panel;
        if (callingEl.up) { //called by a field in the form
            panel = callingEl.up('ortform');
        } else { //called by the form
            panel = callingEl.owner;
        }

        var record = callingEl.getRecord();

        var copybutton = panel.down('button[action=copy]');
        if (dirty && !record.phantom || record.get('readOnly')) {
            copybutton.setDisabled(true);
        } else {
            copybutton.setDisabled(false);
        }
        this.checkCommitEnabled(callingEl);
    },
    /**
     * Callbacks after a Ort has been saved
     */
    afterSave: function(form, json) {
        var i18n = Lada.getApplication().bundle;
        var ozw = form.up('panel').parentWindow;
        var osg = ozw.down('ortstammdatengrid');
        var id = json.data.id;
        var record = ozw.ortstore.getById(id);
        if (record) {
            if (ozw.down('tabpanel')) {
                ozw.down('tabpanel').setActiveTab(0);
            }
            var selmod = osg.getView().getSelectionModel();
            selmod.select(record);
        }
        var resulttext;
        if (json) {
            if (json.message === '201') {
                resulttext = i18n.getMsg('orte.new.notunique');
            }
            if (json.message === '200') {
                resulttext = i18n.getMsg('orte.new.success');
            }
        }
        Ext.Msg.show({
            title: i18n.getMsg('success'),
            autoScroll: true,
            msg: resulttext,
            buttons: Ext.Msg.OK
        });
    },

    discard: function(button) {
        button.up('panel').getForm().reset();
        button.up('panel').down('netzbetreiber').down('combobox').reset();
    },

    /**
     * checks if the Messpunkt can be committed.
     * Disables the save button if false
     */
    checkCommitEnabled: function(callingEl) {
        var panel;
        if (callingEl.up && callingEl.up('ortform')) { //called by a field in the form
            panel = callingEl.up('ortform');
        } else if (callingEl.owner) { //called by the form
            panel = callingEl.owner;
        } else {
            panel = callingEl; //called by the formpanel itself
        }
        if (panel.mode && panel.mode === 'copy') {
            this.checkCommitOnCopyPanel(panel);
        } else {
            this.checkCommitOnNewOrEditPanel(panel);
        }
    },

    /**
     * Checks if a copied Messpunkt can be saved.
     * Save is only enabled if the following attribute combinations are
     * different from the original record:
     * - Coordinates, kdaId and ozId
     * - GemId and ozId
     * - staatId, ortTyp and ozId
     * Otherwise the server wont allow the creation of the Messpunkt and return
     * the original record
     */
    checkCommitOnCopyPanel: function(panel) {
        var i18n = Lada.getApplication().bundle;
        var form = panel.getForm();
        var copy = panel.record;
        var formValues = form.getValues();
        var original = panel.original;
        var valid = true;
        var errors = {ozId: []};
        if (formValues['koordXExtern'] == original.get('koordXExtern')
                && formValues['koordYExtern'] == original.get('koordYExtern')
                && formValues['ozId'] == original.get('ozId')) {
            valid = false;
            errors['koordXExtern'] = ['err.orte.copy.duplicatecoordinates'];
            errors['koordYExtern'] = ['err.orte.copy.duplicatecoordinates'];
            errors['ozId'].push('err.orte.copy.duplicatecoordinates');
        }
        if ( formValues['gemId'] == original.get('gemId')
                && formValues['ozId'] == original.get('ozId')) {
            errors['gemId'] = ['err.orte.copy.duplicategemeinde'];
            errors['ozId'].push('err.orte.copy.duplicategemeinde');
            valid = false;
        }
        if (formValues['staatId'] == original.get('staatId')
                && formValues['ortTyp'] == original.get('ortTyp')
                && formValues['ozId'] == original.get('ozId')) {
            valid = false;
            errors['staatId'] = ['err.orte.copy.duplicatestaat'];
            errors['ortTyp'] = ['err.orte.copy.duplicatestaat'];
            errors['ozId'].push('err.orte.copy.duplicatestaat');
        }

        var revertbutton = panel.down('button[action=revert]');
        var savebutton = panel.down('button[action=save]');
        var copybutton = panel.down('button[action=copy]');


        if (!valid) {
            savebutton.setDisabled(true);
            copybutton.setDisabled(true);

            if ((form.isDirty())
                    || (panel.down('netzbetreiber[name=netzbetreiberId]').getValue().length !== 0) ) {
                panel.down('button[action=revert]').setDisabled(false);
            } else {
                panel.down('button[action=revert]').setDisabled(true);
            }
            panel.setMessages(errors, null);
        } else {
            //If validation was successful, treat panel like an edit panel
            panel.clearMessages();
            this.checkCommitOnNewOrEditPanel(panel);
        }
    },

    /**
     * Checks if Messpunkt can be saved.
     */
    checkCommitOnNewOrEditPanel: function(panel) {
        var savebutton = panel.down('button[action=save]');
        var revertbutton = panel.down('button[action=revert]');
        var copybutton = panel.down('button[action=copy]');

        var form = panel.getForm();
        if ( (form.isDirty()) || (panel.down('netzbetreiber[name=netzbetreiberId]').getValue().length !== 0) ) {
            panel.down('button[action=revert]').setDisabled(false);
        } else {
            panel.down('button[action=revert]').setDisabled(true);
        }
        if ( (form.isValid()) && (panel.down('netzbetreiber[name=netzbetreiberId]').getValue().length !== 0) ) {
            //one of three conditions must apply, the first one depending
            // on three fields
            if (
                (form.findField('kdaId').getValue()
                    && form.findField('koordYExtern').getValue()
                    && form.findField('koordXExtern').getValue()
                )
                || form.findField('gemId').getValue() !== null
                || form.findField('staatId').getValue() !== null
            ) {
                savebutton.setDisabled(false);
            } else {
                savebutton.setDisabled(true);
            }
        } else { //form invalid
            savebutton.setDisabled(true);
        }
    }
});
