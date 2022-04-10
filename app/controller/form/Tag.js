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
        var method = record.phantom ? 'POST': 'PUT';
        var url = record.phantom ?
            this.tagUrl :
            this.tagUrl + '/' + record.get('id');
        if (record.phantom) {
            record.set('id', null);
            record.set('readonly', false);
        }
        Ext.Ajax.request({
            url: url,
            jsonData: record.data,
            method: method,
            success: win.actionCallback,
            failure: win.actionCallback
        });
    },
    deleteTag: function(button){
        var win = button.up('tagmanagementwindow');
        var record = win.down('tagform').getForm().getRecord();
        Ext.Ajax.request({
            url: this.tagUrl + '/' + record.get('id'),
            method: 'DELETE',
            success: win.actionCallback,
            failure: win.actionCallback
        });
    },

    /**
     * Adds (multiple) tags to a list of objects (e.g. Proben, Messungen).
     * Tags already assigned should not result in errors
     */
    addZuordnung: function(button){
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
            success: win.actionCallBack,
            failure: win.failureCallBack
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
            success: win.actionCallBack,
            failure: win.failureCallBack
        });
    },

    /**
     * Validates the tag form
     * @param {*} formEl any calling input box inside thre tag form
     * @returns
     */
    checkTagCommitEnabled: function(formEl) {
        var problemExists = false;
        var form = formEl.up('tagform').getForm();
        var rec = form.getRecord();

        // form should be changed from initial values
        if (!form.isDirty()) {
            formEl.up('tagmanagementwindow').down(
                'button[action=save]').setDisabled(true);
            return false;
        }
        var data = form.getFieldValues(false);

        // the tag should have a name

        if (!data.tag) {
            problemExists = true;
            // set message on 'tag' widget
            // i18n.getMsg('tag.createwindow.err.emptytagname');
        }
        var id = rec.phantom ? undefined: rec.get('id');

        // the tag name should be unique.

        if (formEl.up('tagform').store.tagExists(data.tag, id)) {
            // set message on 'tag' widget
            // i18n.getMsg('tag.createwindow.err.tagalreadyexists');
            problemExists = true;
        }

        // messtelle and netzbetreiber must be set

        if (!data.mstId || !data.netzbetreiberId) {
            problemExists = true;
            // set message(s)
            // TODO: needs to be own?
        }

        //tagtyp permissions

        if (!data.typId) {
            // set message(s)
            problemExists = true;
        } else {
            var oldTyp = rec.get('typId');
            switch(data.typId) {
                case 'mst':
                    if (oldTyp !== 'mst') {
                        //not allowed to downgrade
                        problemExists = true;
                    }
                    //TODO: validUntil should be unchanged or in the future
                    break;
                case 'netzbetreiber':
                    if (!Ext.Array.contains(Lada.funktionen, 4)){
                        // message: not allowed to set netzbetreiber tags
                        problemExists = true;
                    }
                    if (oldTyp !== 'mst' && oldTyp !== 'netzbetreiber' ) {
                        // message: not allowed to downgrade
                        problemExists = true;
                    }
                    break;
                case 'global':
                    if (!Ext.Array.contains(Lada.funktionen, 4)){
                        // message: not allowed to set netzbetreiber tags
                        problemExists = true;
                    }
                    if (
                        ['mst', 'netzbetreiber', 'global'].indexOf(oldTyp) <0
                    ) {
                        // message: not allowed to downgrade
                        problemExists = true;
                    }
                    break;
                case 'auto':
                    problemExists = true;
                    // message: not allowed to edit auto tags
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
        var validity = rec.data.validity;
            if (validity === -1) {
                form.down('[name=infinitegueltigBis]').setHidden(false);
                form.down('datefield[name=gueltigBis]').setDisabled(true);
                form.down('datefield[name=gueltigBis]').setValue(null);
                form.getRecord().set('gueltigBis', null);
                form.down('[name=infinitegueltigBis]').setHidden(false);
            } else {
                var until = new Date().valueOf() + ( 24 * 3600000 * validity );
                form.down('datefield[name=gueltigBis]').setValue(new Date(until));
                form.down('datefield[name=gueltigBis]').setDisabled(false);
                form.down('[name=infinitegueltigBis]').setHidden(true);
            }
            this.checkTagCommitEnabled(tagtypwidget);
    }
});
