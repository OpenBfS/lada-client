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
                'tagform tagtyp combobox': {
                change: this.setGueltigBis
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
    }
});
