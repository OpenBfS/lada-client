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
    extend: 'Lada.controller.form.BaseFormController',
    alias: 'controller.ortform',
    requires: [
        'Lada.view.window.ChangeKDA',
        'Lada.store.Orte'
    ],

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
            'ortform orttyp combobox': {
                change: this.checkorttyp
            },
            'ortform koordinatenart combobox': {
                validitychange: this.enableChangeKDA,
                dirtychange: this.enableChangeKDA
            },
            'ortform tfield [name=coordXExt]': {
                validitychange: this.enableChangeKDA,
                dirtychange: this.enableChangeKDA
            },
            'ortform tfield [name=coordYExt]': {
                validitychange: this.enableChangeKDA,
                dirtychange: this.enableChangeKDA
            },
            'ortform': {
                validitychange: this.checkCommitEnabled,
                dirtychange: this.checkCommitEnabled
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
        copy.set('extId', null);
        copy.set('referenceCount', 0);
        copy.set('plausibleReferenceCount', 0);
        copy.set('referenceCountMp', 0);
        var win = Ext.create('Lada.view.window.Ort', {
            record: copy
        });
        var pos = button.up('ortform').up().getPosition();
        pos[0] += 10;
        pos[1] += 10;
        win.show();
        win.setPosition(pos);

        //Copy over site images if available
        var images = button.up('window').down('siteimages').getImageUrls();
        win.down('siteimages').setImages(images.image, images.map);
    },

    save: function(button) {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var formpanel = button.up('ortform');
        var record = formpanel.getRecord();

        // Update record with values changed in the form
        record.set(formpanel.getForm().getFieldValues(true));
        if (record.phantom) {
            record.set('id', null);
        }

        var doSave = function() {
            record.save({
                scope: me,
                success: function(newrecord) {
                    var win = formpanel.up('window');
                    win.down('siteimages').uploadPresetImages();

                    var dynamicgrid = Ext.getCmp('dynamicgridid');
                    if (dynamicgrid) {
                        dynamicgrid.reload();
                    }

                    // Update Geolocat window if saving the Site object
                    // was triggered from there
                    var ozw = formpanel.up('panel').parentWindow;
                    if (ozw && ozw.down('tabpanel')) {
                        var ortgrid = ozw.down('tabpanel')
                            .down('ortstammdatengrid');
                        if (ortgrid) {
                            if (ortgrid.store.storeId === 'ext-empty-store') {
                                ortgrid.store = Ext.create('Lada.store.Orte');
                            }
                            ortgrid.store.add(newrecord);
                            ortgrid.store.reload();

                            //If new site shall be set in geolocat window:
                            //Add to map and select using the grid
                            if (win.setOzOnComplete === true ) {
                                ozw.down('map').addLocations(ortgrid.store);
                                ozw.down('ortszuordnungform')
                                    .setOrt(null, newrecord);
                                ortgrid.getView().getSelectionModel()
                                    .select(newrecord);
                            }
                        }
                    }

                    if (win.closeRequested) {
                        win.doClose();
                    } else {
                        formpanel.loadRecord(newrecord);
                        formpanel.down('verwaltungseinheit').store.clearFilter();
                        formpanel.down('staat').store.clearFilter();
                        formpanel.setMessages(
                            newrecord.get('errors'),
                            newrecord.get('warnings'),
                            newrecord.get('notifications'));
                        win.setTitleAndReadOnly();
                    }
                },
                failure: me.handleSaveFailure
            });
        };
        var plausibleRefs = record.get('plausibleReferenceCount');
        if (plausibleRefs > 0) {
            Ext.Msg.show({
                title: 'Achtung',
                icon: Ext.Msg.WARNING,
                message: i18n.getMsg(
                    'warn.ort.editreferencedort.message',
                    plausibleRefs),
                buttons: Ext.Msg.YESNO,
                fn: function(btn) {
                    if (btn === 'yes') {
                        doSave();
                    }
                }
            });
        } else {
            doSave();
        }
    },

    discard: function(button) {
        button.up('panel').getForm().reset();
    },

    checkorttyp: function(combo) {
        var orttyp = combo.getValue();
        if (orttyp === 3) {
            combo.up('ortform').down('fieldset').expand();
        } else {
            var form = combo.up('ortform');
            form.down('tfield[name=reiReportText]').setValue(null);
            form.down('reiprogpunktgruppe[name=reiAgGrId]').setValue(null);
            form.down('ktagruppe[name=nuclFacilGrId]').setValue(null);
            form.down('tfield[name=reiZone]').setValue(null);
            form.down('tfield[name=reiSector]').setValue(null);
            form.down('tfield[name=reiOprMode]').setValue(null);
            form.down('tfield[name=reiCompetence]').setValue(null);
            form.down('chkbox[name=isReiActive]').setValue(false);
            form.down('fieldset').collapse();
        }
    },

    /**
     * Set disabled state of button to open coordinate transformation dialogue.
     */
    enableChangeKDA: function() {
        var panel = this.getView();
        var record = panel.getRecord();
        panel.down('button[action=changeKDA]').setDisabled(
            record.get('readonly')
                || record.get('plausibleReferenceCount') > 0
                || record.get('referenceCountMp') > 0
                || !(panel.down('koordinatenart').isValid()
                     && panel.down('tfield[name=coordXExt]').isValid()
                     && panel.down('tfield[name=coordYExt]').isValid()));
    },

    checkCommitEnabled: function(callingEl) {
        var panel = callingEl.owner;
        var record = panel.getRecord();
        var form = panel.getForm();

        var readonly = record.get('readonly');
        var dirty = form.isDirty();

        panel.down('button[action=copy]').setDisabled(
            readonly || dirty && !record.phantom);

        panel.down('button[action=revert]').setDisabled(readonly || !dirty);

        // Enable saving of dirty and phantom records
        panel.down('button[action=save]').setDisabled(
            readonly || !form.isValid() || !(dirty || record.phantom));
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
        var win = Ext.create('Lada.view.window.ChangeKDA', {
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
            panel.down('tfield[name=coordXExt]').getValue());
        win.down('selectabledisplayfield[name=originalY]').setValue(
            panel.down('tfield[name=coordYExt]').getValue());
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
                url: 'lada-server/rest/spatrefsys',
                method: 'POST',
                jsonData: {
                    'from': win.down('koordinatenart[name=originalKDA]')
                        .getValue(),
                    'to': win.down('koordinatenart[name=newKDA]').getValue(),
                    'x': win.down('selectabledisplayfield[name=originalX]')
                        .getValue(),
                    'y': win.down('selectabledisplayfield[name=originalY]')
                        .getValue()
                },
                success: function(response) {
                    win.setLoading(false);
                    if (response && response.responseText) {
                        var messageContainer = win.down(
                            'container[name=messageContainer]');
                        var json = Ext.decode(response.responseText);
                        if (json.data) {
                            messageContainer.setHidden(true);
                            win.down('koordinatenart[name=newKDA]')
                                .setReadOnly(false);
                            win.down('selectabledisplayfield[name=newX]')
                                .setValue(json.data.x);
                            win.down('selectabledisplayfield[name=newY]')
                                .setValue(json.data.y);
                            win.down('button[action=apply]')
                                .setDisabled(false);
                        } else {
                            messageContainer.setHidden(false);
                            var messageField = win.down(
                                'textareafield[name=message]');
                            messageField.setValue(
                                i18n.getMsg('err.msg.ort.changeKda'));
                            // TODO error handling: calculation not successful.
                            // For now, just resets
                            win.down('koordinatenart[name=newKDA]').setValue(
                                win.down('koordinatenart[name=originalKDA]')
                                    .getValue());
                            win.down('koordinatenart[name=newKDA]')
                                .setReadOnly(false);
                        }
                    }
                },
                failure: function() {
                    win.setLoading(false);
                    var messageContainer = win.down(
                        'container[name=messageContainer]');
                    var messageField = win.down(
                        'textareafield[name=message]');
                    messageContainer.setHidden(false);
                    messageField.setValue(
                        i18n.getMsg('err.msg.ort.changeKda'));
                    win.down('button[action=apply]').setDisabled(true);
                    win.down('koordinatenart[name=newKDA]').setValue(
                        win.down('koordinatenart[name=originalKDA]')
                            .getValue());
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
        win.parentWindow.down('tfield[name=coordXExt]').setValue(
            win.down('selectabledisplayfield[name=newX]').getValue()
        );
        win.parentWindow.down('tfield[name=coordYExt]').setValue(
            win.down('selectabledisplayfield[name=newY]').getValue()
        );
        win.close();
    }
});
