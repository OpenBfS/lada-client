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
        this.editZuordnung(button, false);
    },

    /**
     * Removes (multiple) tags from a list of objects (e.g. Proben, Messungen).
     * Tags that are not on these objects will silently be ignored
     */
    removeZuordnung: function(button) {
        this.editZuordnung(button, true);
    },

    editZuordnung: function(button, isDelete) {
        var i18n = Lada.getApplication().bundle;
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
        Ext.Ajax.request({
            url: 'lada-server/rest/tag/zuordnung' + (isDelete ? '/delete' : ''),
            method: 'POST',
            jsonData: payload,
            success: function(response) {
                var json = Ext.decode(response.responseText);
                if (json.success) {
                    // Reload tagwidget in edit form or parent grid
                    if (win.parentWindow) {
                        win.parentWindow.down('tagwidget').reload();
                    } else {
                        var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                        if (parentGrid.length === 1) {
                            parentGrid[0].reload();
                        }
                    }

                    // Check for errors per assignment
                    var msgs = '';
                    var tagStore = Ext.getStore('tags');
                    json.data.forEach(function(item) {
                        if (!item.success) {
                            msgs += tagStore.getById(item.data.tagId).get('tag')
                                + ': ' + i18n.getMsg(item.message) + '<br>';
                        }
                    });
                    if (msgs) {
                        Ext.Msg.alert(
                            i18n.getMsg('tag.widget.err.genericsave'), msgs);
                    }
                } else {
                    Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                                  i18n.getMsg(json.message));
                }
            },
            failure: function() {
                Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                              i18n.getMsg('err.msg.generic.body'));
            }
        });
    },

    checkCommitEnabled: function(tagfield) {
        var disable = !tagfield.isDirty();
        var win = tagfield.up('settags');
        win.down('button[action=bulkaddzuordnung]').setDisabled(disable);
        win.down('button[action=bulkdeletezuordnung]').setDisabled(disable);
    }
});
