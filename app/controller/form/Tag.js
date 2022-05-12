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
            'tagform': {
                validitychange: this.checkTagCommitEnabled,
                dirtychange: this.checkTagCommitEnabled
            }
        });
    },

    saveTag: function(button) {
        var win = button.up('tagmanagementwindow');
        var record = win.down('tagform').getForm().getRecord();
        record.set(win.down('tagform').getForm().getFieldValues());
        record.save({
            success: function(rec) {
                var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                if (parentGrid.length === 1) {
                    parentGrid[0].reload();
                }
                Ext.getStore('tags').add(rec);
                win.close();
            },
            failure: this.handleTagFailure
        });
    },

    deleteTag: function(button) {
        var win = button.up('tagmanagementwindow');
        win.down('tagform').getForm().getRecord().erase({
            success: function(rec) {
                var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                if (parentGrid.length === 1) {
                    parentGrid[0].reload();
                }
                Ext.getStore('tags').remove(rec);
                win.close();
            },
            failure: this.handleTagFailure
        });
    },

    /**
     * Failure callback for Model's save() and erase().
     */
    handleTagFailure: function(record, operation) {
        var i18n = Lada.getApplication().bundle;
        var err = operation.getError();
        var msg = i18n.getMsg('err.msg.generic.body');
        if (err) {
            if (err instanceof String) {
                msg = err;
            } else {
                msg = err.response.responseText;
                if (!msg && err.response.timedout) {
                    msg = i18n.getMsg('err.msg.timeout');
                }
            }
        } else {
            msg = i18n.getMsg(
                Ext.decode(operation.getResponse().responseText).message);
        }
        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'), msg);
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
     * Enable/disable save button in TagManagement window.
     */
    checkTagCommitEnabled: function(form) {
        form.owner.up('tagmanagementwindow').down('button[action=save]')
            .setDisabled(
                !form.isDirty()
                    || !form.isValid()
                    || form.getRecord().get('readonly')
            );
    }
});
