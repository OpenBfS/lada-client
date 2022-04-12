/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
* This is a controller for Tag management, create and assign forms
*/
Ext.define('Lada.controller.form.Tag', {
    extend: 'Ext.app.Controller',
    tagUrl: 'lada-server/rest/tag',
    zuordnungUrl: 'lada-server/rest/tag/zuordnung',

    init: function() {
        this.control({
            'tagmanagementwindow button[action=save]': {
                click: this.saveTag
            },
            'tagmanagementwindow button[action=delete]': {
                click: this.deleteTag
            },
            'settags button[action=bulkaddzuordnung]': {
                click: this.addZuordnung
            },
            'settags button[action=bulkdeletezuordnung]': {
                click: this.removeZuordnung
            },
            'tagform textfield[name=tag]': {
                change: this.checkTagCommitEnabled
            },
            'tagform messstelle combobox': {
                change: this.checkTagCommitEnabled
            },
            'tagform netzbetreiber combobox': {
                change: this.checkTagCommitEnabled
            },
            'tagform tagtyp combobox': {
                change: this.setGueltigBis
            },
            'tagform datefield[name=gueltigBis]': {
                change: this.checkTagCommitEnabled
            }
        });
    },

    saveTag: function(button) {
        var win = button.up('tagmanagementwindow');
        var record = win.down('tagform').getForm().getRecord();
        var data = win.down('tagform').getForm().getFieldValues(false);
        var method = record.phantom ? 'POST': 'PUT';
        var url = record.phantom ?
            this.tagUrl :
            this.tagUrl + '/' + record.get('id');
        if (record.phantom) {
            record.set('id', null);
            record.set('readonly', false);
        }
        record.set('mstId', data.mstId);

        var netzbetreiber = win.down('netzbetreiber').getValue()[0];
        record.set('netzbetreiberId', netzbetreiber);
        record.set('tag', data.tag);
        record.set('typId', data.typId);
        record.set('gueltigBis', data.gueltigBis);
        Ext.Ajax.request({
            url: url,
            jsonData: record.data,
            method: method,
            success: function(response) {
                win.actionCallback(response);
            },
            failure: function(response) {
                win.actionCallback(response);
            }
        });
    },
    deleteTag: function(button) {
        var win = button.up('tagmanagementwindow');
        var record = win.down('tagform').getForm().getRecord();
        Ext.Ajax.request({
            url: this.tagUrl + '/' + record.get('id'),
            method: 'DELETE',
            success: function(response) {
                win.actionCallback(response);
            },
            failure: function(response) {
                win.actionCallback(response);
            }
        });
    },

    /**
     * Adds (multiple) tags to a list of objects (e.g. Proben, Messungen).
     * Tags already assigned should not result in errors
     */
    addZuordnung: function(button) {
        var win = button.up('settags');
        var selection = win.selection;
        var recname = win.recordType === 'messung' ? 'messungId' : 'probeId';
        var taglist = win.down('tagwidget').getValue();
        if (!taglist.length) {
            win.failureCallBack({ error: 'noselection'});
            return;
        }
        var payload = { tagId: taglist };
        payload[recname] = selection;
        Ext.Ajax.request({
            url: this.zuordnungUrl,
            method: 'POST',
            jsonData: JSON.stringify([payload]),
            success: function(response) {
                win.actionCallback(response);
            },
            failure: function(response) {
                win.failureCallBack(response);
            }
        });
    },

    /**
     * Removes (multiple) tags from a list of objects (e.g. Proben, Messungen).
     * Tags that are not on these objects will silently be ignored
     */
    removeZuordnung: function(button) {
        var win = button.up('settags');
        var recname = win.recordType === 'messung' ? 'messungId' : 'probeId';
        var tagIds = win.down('tagwidget').getValue();
        if (!tagIds.length) {
            win.failureCallBack({ error: 'noselection'});
            return;
        }
        var payload = { tagId: tagIds };
        payload[recname] = win.selection;
        Ext.Ajax.request({
            url: this.zuordnungUrl + '/delete',
            method: 'POST',
            jsonData: JSON.stringify([payload]),
            success: function(response) {
                win.actionCallback(response);
            },
            failure: function(response) {
                win.actionCallback(response);
            }
        });
    },

    /**
     * Validates the tag form
     * @param {*} formEl any calling input box inside thre tag form
     * @returns
     */
    checkTagCommitEnabled: function(formEl) {

        //TODO clear Warnings and errors
        var problemExists = false;
        var win = formEl.up('tagform');
        var form = win.getForm();
        var rec = form.getRecord();
        // var i18n = Lada.getApplication().bundle;

        // form should be changed from initial values
        if (!form.isDirty()) {
            formEl.up('tagmanagementwindow').down(
                'button[action=save]').setDisabled(true);
            return false;
        }
        var data = form.getFieldValues(false);
        var netzbetreiber = win.down('netzbetreiber').getValue()[0];
        // TODO netzbetreiber somehow is not part of the form ?

        // the tag should have a name

        if (!data.tag) {
            problemExists = true;
            // win.down('textfield[name=tag]').showErrors(
            //     i18n.getMsg('tag.createwindow.err.emptytagname'));
        }
        var id = rec.phantom ? undefined: rec.get('id');

        // the tag name should be unique.

        if (formEl.up('tagform').store.tagExists(data.tag, id)) {
            // win.down('textfield[name=tag]').showErrors(
            //     i18n.getMsg('tag.createwindow.err.tagalreadyexists'));
            problemExists = true;
        }

        // messtelle and netzbetreiber must be set

        if (!data.mstId) {
            // win.down('messstelle').showErrors(
            //     i18n.getMsg('tag.createwindow.err.noemptyField'));
            problemExists = true;
        }

        if (!netzbetreiber) {
            // win.down('netzbetreiber').showErrors(
            //     i18n.getMsg('tag.createwindow.err.noemptyField'));
            problemExists = true;
            // TODO: needs to be own?
        }

        //tagtyp permissions

        if (!data.typId) {
            // win.down('tagtyp').showErrors(
            //     i18n.getMsg('tag.createwindow.err.noemptyField'));
            problemExists = true;
        } else {
            var oldTyp = rec.get('typId');
            switch (data.typId) {
                case 'mst':
                    if (oldTyp && oldTyp !== 'mst') {
                        // win.down('tagtyp').showErrors(
                        //     i18n.getMsg('tag.tagtyp.err.downgrade'));
                        problemExists = true;
                    }
                    //TODO: validUntil should be unchanged or in the future
                    break;
                case 'netzbetreiber':
                    if (!Ext.Array.contains(Lada.funktionen, 4)) {
                        // win.down('tagtyp').showErrors(
                        //     i18n.getMsg('tag.tagtyp.err.permission'));
                        problemExists = true;
                    }
                    if (
                        oldTyp &&
                        ['mst', 'netzbetreiber'].indexOf(oldTyp) <0
                    ) {
                        // win.down('tagtyp').showErrors(
                        //     i18n.getMsg('tag.tagtyp.err.downgrade'));
                        problemExists = true;
                    }
                    break;
                case 'global':
                    if (!Ext.Array.contains(Lada.funktionen, 4)) {
                        // win.down('tagtyp').showErrors(
                        //     i18n.getMsg('tag.tagtyp.err.permission'));
                        problemExists = true;
                    }
                    if (
                        oldTyp &&
                        ['mst', 'netzbetreiber', 'global'].indexOf(oldTyp) <0
                    ) {
                        // win.down('tagtyp').showErrors(
                        //     i18n.getMsg('tag.tagtyp.err.downgrade'));
                        problemExists = true;
                    }
                    break;
                case 'auto':
                    problemExists = true;
                    // win.down('tagtyp').showErrors(
                    //     i18n.getMsg('tag.tagtyp.err.permission'));
                    break;
            }
        }
        formEl.up('tagmanagementwindow').down(
            'button[action=save]').setDisabled(problemExists);
    },

    /**
     * (Re-) sets the default validity given for a tag type as the tag type is
     * being changed. (refer tagtyp store for types and defaults being defined
     * in days )
     * @param tagtypwidget the calling widget
     * @param newVal the new widget's value
     */
    setGueltigBis: function(tagtypwidget, newVal) {
        var form = tagtypwidget.up('tagform');
        var rec = tagtypwidget.store.findRecord('value', newVal);
        if (!rec) {
            this.checkTagCommitEnabled(tagtypwidget);
            return;
        }
        var validity = rec.data.validity;
        if (validity === -1) {
            form.down('[name=infinitegueltigBis]').setHidden(false);
            form.down('datefield[name=gueltigBis]').setDisabled(true);
            form.down('datefield[name=gueltigBis]').setValue(null);
            form.getRecord().set('gueltigBis', null);
            form.down('[name=infinitegueltigBis]').setHidden(false);
        } else {
            var until = new Date().valueOf() + ( 24 * 3600000 * validity );
            form.down('datefield[name=gueltigBis]').setValue(
                new Date(until));
            form.down('datefield[name=gueltigBis]').setDisabled(false);
            form.down('[name=infinitegueltigBis]').setHidden(true);
        }
        this.checkTagCommitEnabled(tagtypwidget);
    }

});
