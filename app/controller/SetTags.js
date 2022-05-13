/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
* This is a controller for Tag assignment form
*/
Ext.define('Lada.controller.SetTags', {
    extend: 'Ext.app.Controller',
    zuordnungUrl: 'lada-server/rest/tag/zuordnung',

    init: function() {
        this.control({
            'settags button[action=bulkaddzuordnung]': {
                click: this.addZuordnung
            },
            'settags button[action=bulkdeletezuordnung]': {
                click: this.removeZuordnung
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
    }
});
