/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

//TODO: non-functional yet

/**
* This is a controller for Tag management, create and assign forms
*/
Ext.define('Lada.controller.form.Tag', {
    extend: 'Ext.app.Controller',
    tagUrl: 'lada-server/rest/tag',
    zuordnungUrl: 'lada-server/rest/tag/zuordnung',

    init: function() {
        this.control({
            'tagcreatewindow button[action=save]': {
                click: this.saveNewTag
            },
            'tagmanagementwindow button[action=save]': {
                click: this.saveTag
            },
            'tagmanagementwindow button[action=delete]': {
                click: this.deleteTag
            },
            'settags button[action=add]': {
                click: this.addZuordnung
            },
            'settags button[action=remove]': {
                click: this.removeZuordnung
            }
        });
    },

    /**
     * Creates a new Tag
     */
    saveNewTag: function(button){
        var win = button.up('tagcreatewindow');
        var record = win.record;
        record.set('id', null);
        record.set('readonly', false);
        Ext.Ajax.request({
            url: this.tagUrl,
            jsonData: JSON.stringify(record),
            method: 'POST',
            success: function() { //response) {
                // win: success/failure
                // win: open tag management with resulting record ?
            }
        });
        // tags: [ { $TAG_DEF }
    },

    saveTag: function(button) {
        var win = button.up('tagmanagementwindow');
        var record = win.record;
        Ext.Ajax.request({
            url: this.tagUrl + '/' + record.get('id'),
            jsonData: JSON.stringify(record),
            method: 'PUT'
            //TODO callbacks
        });
    },
    deleteTag: function(button){
        var win = button.up('tagmanagementwindow');
        var record = win.record;
        Ext.Ajax.request({
            url: this.tagUrl + '/' + record.get('id'),
            method: 'DELETE'
            //TODO callbacks
        });
    },

    /**
     * Adds (multiple) tags to a list of objects (e.g. Proben, Messungen).
     * Tags already assigned should not result in errors
     */
    addZuordnung: function(button){
        var win = button.up('settags');
        var selection = win.selection;
        var recordname = win.recordType === 'messung' ? 'messungId' : 'probeId';
        var taglist = []; // TODO
        var zuordnung = {};
        zuordnung[recordname] = selection;
        zuordnung.tagId = taglist;
        var record = [zuordnung];
        Ext.Ajax.request({
            url: this.zuordnungUrl,
            method: 'POST',
            jsonData: JSON.stringify(record)
        });
    },

    /**
     * Removes (multiple) tags from a list of objects (e.g. Proben, Messungen).
     * Tags that are not on these objects will silently be ignored
     */
    removeZuordnung: function() { // button){
        // var win = button.up('settags');
        //TODO:  this.zuordnungUrl, delete request: id of zuordnung required ?
        // window has list of assigned tags
    },

    // TODO: add to all callbacks
    refreshTagStore: function(){
        //TODO check if filtered?
        var store = Ext.data.StoreManager.get('tags');
        store.reload();
    }
});
