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
                change: this.checkEmpty,
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
        var selection = win.getSelection();
        var taglist = win.down('tagwidget').getValue();

        var payload = [];
        selection.forEach(function(selected) {
            taglist.forEach(function(tag) {
                if (win.recordType === 'messung') {
                    payload.push({measmId: selected, tagId: tag});
                } else {
                    payload.push({sampleId: selected, tagId: tag});
                }
            });
        });
        Ext.Ajax.request({
            url: 'lada-server/rest/tag/taglink' + (isDelete ? '/delete' : ''),
            method: 'POST',
            jsonData: payload,
            success: function(response) {
                var json = Ext.decode(response.responseText);
                if (json.success) {
                    var tagStore = Ext.getStore('tags');

                    // Check for errors per assignment
                    var msgs = '';
                    var successTags = [];
                    json.data.forEach(function(item) {
                        if (!item.success) {
                            msgs += tagStore.getById(item.data.tagId)
                                .get('name')
                                + ': ' + i18n.getMsg(item.message) + '<br>';
                        } else {
                            successTags.push(item.data.tagId);
                        }
                    });

                    // Update parent grid or tagwidget in edit form
                    if (win.parentWindow) {
                        var widget = win.parentWindow.down('tagwidget');
                        var oldSelection = widget.getValue();
                        var newSelection = isDelete
                            ? Ext.Array.difference(oldSelection, successTags)
                            : Ext.Array.merge(oldSelection, successTags);
                        widget.setValue(newSelection);
                    } else {
                        var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                        if (parentGrid.length === 1) {
                            parentGrid[0].reload();
                        }
                    }

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

    checkEmpty: function(tagfield) {
        var disable = !tagfield.getValue().length;
        var win = tagfield.up('settags');
        win.down('button[action=bulkaddzuordnung]').setDisabled(disable);
        win.down('button[action=bulkdeletezuordnung]').setDisabled(disable);
    },

    checkCommitEnabled: function(tagfield) {
        var win = tagfield.up('settags');
        win.down('button[action=bulkaddzuordnung]').setDisabled(
            !tagfield.getValue().length
            // Keep enabled if working on grid selection because
            // the latter might change and then posting an unchanged
            // tag selection can make sense.
                || (win.parentWindow && !tagfield.isDirty()));
    }
});
