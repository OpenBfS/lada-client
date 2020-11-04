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
    requires: ['Lada.view.window.ChangeKDA'],

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
            'ortform tfield [name=koordXExtern]': {
                change: this.checkCommitEnabled
            },
            'ortform tfield [name=koordYExtern]': {
                change: this.checkCommitEnabled
            },
            'ortform': {
                validitychange: this.checkCommitEnabled,
                dirtychange: this.handleDirtyChange
            },
            'ortform button[action=changeKDA]': {
                click: this.openChangeKDA
            },
            'changeKDA button[action=apply]': {
                click: this.onKDAApply
            },
            'changeKDA koordinatenart[name=newKDA] combobox': {
                change: this.onKDARecalculation
            }
        });
    },

    copyOrt: function(button) {
        var record = button.up('ortform').getForm().getRecord();
        var copy = record.copy(null);
        copy.set('ortId', null);
        copy.set('referenceCount', 0);
        copy.set('plausibleReferenceCount', 0);
        var win = Ext.create('Lada.view.window.Ort',{
            record: copy,
            mode: 'copy',
            original: record
        });
        var pos = button.up('ortform').up().getPosition();
        pos[0] += 10;
        pos[1] += 10;
        win.show();
        win.setPosition(pos);
    },

    save: function(button) {
        var i18n = Lada.getApplication().bundle;
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

        var doSave = function() {
            record.save({
                success: function(newrecord, response) {
                    form.loadRecord(newrecord);
                    formpanel.down('verwaltungseinheit').store.clearFilter();
                    formpanel.down('staat').store.clearFilter();
                    if (formpanel.up('window').setOzOnComplete === true ) {
                        var ozf = Ext.ComponentQuery.query('ortszuordnungform')[0];
                        if (ozf) {
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
        };
        var plausibleRefs = record.get('plausibleReferenceCount');
        if (plausibleRefs > 0) {
            Ext.Msg.show({
                title: 'Achtung',
                icon: Ext.Msg.WARNING,
                message: i18n.getMsg('warn.ort.editreferencedort.message', plausibleRefs),
                buttons: Ext.Msg.YESNO,
                fn: function(button) {
                    if (button === 'yes') {
                        doSave();
                    }
                }
            });
        } else {
            doSave();
        }
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
        if ( ((callingEl.name === 'koordXExtern') || (callingEl.name === 'koordXExtern')) && (panel.mode === 'copy') && panel.original && panel.form.isDirty()
            && panel.getForm().getValues()['koordXExtern'] !== '' && panel.getForm().getValues()['koordYExtern'] !== '') {
            panel.down('verwaltungseinheit[name=gemId]').clearValue();
        }
        this.checkKDAchangeEnabled(panel);
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
        var errors = {};
        //Helper function to compare form values and record values.
        //As empty form values are saved as "" and empty record values as null,
        //the == operator will fail to compare them
        var equals = function(first, second) {
            first = first === '' ? null: first;
            second = second === '' ? null: second;
            return first === second;
        };
        if (equals(formValues['koordXExtern'], original.get('koordXExtern'))
                && equals(formValues['koordYExtern'], original.get('koordYExtern'))) {
            valid = false;
            errors['koordXExtern'] = ['err.orte.form.copy.duplicatecoordinates'];
            errors['koordYExtern'] = ['err.orte.form.copy.duplicatecoordinates'];
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
        if (!form.getRecord().phantom && form.getRecord().get('readonly')) {
            savebutton.setDisabled(true);
            return;
        }
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
    },

    /**
     * Checks if the KDA change diaog can be used from a form with coordinate
     * fields (some coordinates set; form is not readonly)
     * @param panel the panel around the form to check
     */
    checkKDAchangeEnabled: function(panel) {
        var form = panel.getForm();
        if (form.getRecord().get('readonly')) {
            panel.down('button[action=changeKDA]').setDisabled(true);
            return;
        }
        if (panel.down('koordinatenart').getValue()
            && panel.down('tfield[name=koordXExtern]').getValue()
            && panel.down('tfield[name=koordYExtern]').getValue()
        ) {
            panel.down('button[action=changeKDA]').setDisabled(false);
        } else {
            panel.down('button[action=changeKDA]').setDisabled(true);
        }
    },

    /**
     * Activates and opens the changeKDA window
     * @param button any element from inside an ort form, currently the change
     * kda button
     */
    openChangeKDA: function(button) {
        var panel = button.up('panel');
        var i18n = Lada.getApplication().bundle;
        // von Koordinatenart: form.get()
        // dropdownBox: Koordinatenarten:
        var win = Ext.create('Lada.view.window.ChangeKDA',{
            parentWindow: panel,
            modal: true,
            title: i18n.getMsg('changeKDA.title')
        });
        win.show();
        win.down('koordinatenart[name=originalKDA]').setValue(
            panel.down('koordinatenart').getValue());
        win.down('koordinatenart[name=newKDA]').setValue(
            panel.down('koordinatenart').getValue());
        win.down('selectabledisplayfield[name=originalX]').setValue(
            panel.down('tfield[name=koordXExtern]').getValue());
        win.down('selectabledisplayfield[name=originalY]').setValue(
            panel.down('tfield[name=koordYExtern]').getValue());
    },

    /**
     * Triggers a recalculation of the coordinates with a new koordinatenart.
     * This calculation is done server side. After this calculation has been
     * completed, the 'newKDA'... fields will be set, and the apply button
     * activated.
     * @param button any element from inside the kda change window
     */
    onKDARecalculation: function(button) {
        var win = button.up('window');
        var i18n = Lada.getApplication().bundle;
        win.down('button[action=apply]').setDisabled(true);
        if (
            win.down('koordinatenart[name=newKDA]').getValue() === win.down(
                'koordinatenart[name=originalKDA]').getValue()
        ||
            !win.down('koordinatenart[name=newKDA]').getValue()
        ) {
            // reset to original if the value is as in the original
            win.down('selectabledisplayfield[name=newX]').setValue(
                win.down('selectabledisplayfield[name=originalX]').getValue()
            );
            win.down('selectabledisplayfield[name=newY]').setValue(
                win.down('selectabledisplayfield[name=originalY]').getValue()
            );
            return;
        } else {
            win.setLoading(true);
            win.down('koordinatenart[name=newKDA]').setReadOnly(true);
            Ext.Ajax.request({
                url: 'lada-server/rest/koordinatenart',
                method: 'POST',
                jsonData: {
                    'from': win.down('koordinatenart[name=originalKDA]').getValue(),
                    'to': win.down('koordinatenart[name=newKDA]').getValue(),
                    'x': win.down('selectabledisplayfield[name=originalX]').getValue(),
                    'y': win.down('selectabledisplayfield[name=originalY]').getValue()
                },
                success: function(response) {
                    win.setLoading(false);
                    if (response && response.responseText) {
                        var json = Ext.decode(response.responseText);
                        if (json.data) {
                            var coords = Ext.decode(json.data);
                            win.down('koordinatenart[name=newKDA]').setReadOnly(false);
                            win.down('selectabledisplayfield[name=newX]').setValue(coords.x);
                            win.down('selectabledisplayfield[name=newY]').setValue(coords.y);
                            win.down('button[action=apply]').setDisabled(false);
                        } else {
                            var messageContainer = win.down('container[name=messageContainer]');
                            var messageField = win.down('textareafield[name=message]');
                            messageContainer.setHidden(false);
                            messageField.setValue(i18n.getMsg('err.msg.ort.changeKda'));
                            // TODO error handling: calculation not successful. For now, just resets
                            win.down('koordinatenart[name=newKDA]').setValue(
                                win.down('koordinatenart[name=originalKDA]').getValue());
                            win.down('koordinatenart[name=newKDA]').setReadOnly(false);
                        }
                    }
                },
                failure: function() {
                    win.setLoading(false);
                    win.down('button[action=apply]').setDisabled(true);
                    win.down('koordinatenart[name=newKDA]').setValue(
                        win.down('koordinatenart[name=originalKDA]').getValue());
                    win.down('koordinatenart[name=newKDA]').setReadOnly(false);
                }
            });
        }
    },

    /**
     * Applies the new values from the KDA change window to the parent's
     * coordinates and closes the KDA change window. It does not submit the new
     * coordinates for the model.
     * @param button any element from the original window, currently the 'apply'
     * button
     */
    onKDAApply: function(button) {
        var win = button.up('window');
        win.parentWindow.down('koordinatenart').setValue(
            win.down('koordinatenart[name=newKDA]').getValue()
        );
        win.parentWindow.down('tfield[name=koordXExtern]').setValue(
            win.down('selectabledisplayfield[name=newX]').getValue()
        );
        win.parentWindow.down('tfield[name=koordYExtern]').setValue(
            win.down('selectabledisplayfield[name=newY]').getValue()
        );
        win.close();
    }
});
