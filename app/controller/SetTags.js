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
            'settags tagwidget': {
                dirtychange: this.checkCommitEnabled
            },
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
        Ext.Ajax.request({
            url: this.zuordnungUrl,
            method: 'POST',
            jsonData: this.getPayload(button),
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
        Ext.Ajax.request({
            url: this.zuordnungUrl + '/delete',
            method: 'POST',
            jsonData: this.getPayload(button),
            success: function(response) {
                win.actionCallback(response);
            },
            failure: function(response) {
                win.actionCallback(response);
            }
        });
    },

    getPayload: function(button) {
        var win = button.up('settags');
        var selection = win.selection;
        var taglist = win.down('tagwidget').getValue();

        var payload = [];
        selection.forEach(function(selected) {
            taglist.forEach(function(tag) {
                if (win.recordType === 'messung') {
                    payload.push({messungId: selected, tagId: tag});
                } else {
                    payload.push({probeId: selected, tagId: tag});
                }
            });
        });
        return payload;
    },

    checkCommitEnabled: function(tagfield) {
        var disable = !tagfield.isDirty();
        var win = tagfield.up('settags');
        win.down('button[action=bulkaddzuordnung]').setDisabled(disable);
        win.down('button[action=bulkdeletezuordnung]').setDisabled(disable);
    }
});
