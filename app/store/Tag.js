/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Tags
 */
Ext.define('Lada.store.Tag', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Tag',
    autoLoad: true,
    //Probe id used for filtering for selected tags
    pId: null,
    sorters: ['tag'],

    //A second store instance used for filtering
    assignedTagsStore: null,

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/tag',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },

    /**
     * Set the probe id as a filter param to get assigned tags
     */
    setProbe: function(pId) {
        if (!this.assignedTagsStore) {
            this.assignedTagsStore = Ext.create('Lada.store.Tag');
        }
        this.pId = pId;
        this.assignedTagsStore.proxy.extraParams = {
            pid: pId
        };
    },

    /**
     * Loads the store holding the tags, assigned to the current probe
     */
    loadAssignedTags: function(scope, callback) {
        this.assignedTagsStore.load({
            scope: scope,
            callback: callback
        });
    },

    /**
     * Creates a new tag for the current probe using a POST request
     */
    createTag: function(tag, callback) {
        var zuordnung = {
            probeId: this.pId,
            tag: tag
        };
        Ext.Ajax.request({
            url: this.proxy.url,
            method: 'POST',
            jsonData: zuordnung,
            callback: callback
        });
    },

    /**
     * Creates a new to for a given probeId using a POST request
     * @param tagName Tag name
     * @param pId Probe id to create tag for
     * @param callback Callback function to call after save
     */
    createTagForPid: function(tagName, pId, callback) {
        var mstId = Lada.mst[0];
        var tag = {
            tag: tagName,
            mstId: mstId
        };
        var zuordnung = {
            probeId: pId,
            tag: tag
        };
        Ext.Ajax.request({
            url: this.proxy.url,
            method: 'POST',
            jsonData: zuordnung,
            callback: callback
        });
    },

    /**
     * Creates a new reference from the current probe to the given tag using a POST request
     */
    createZuordnung: function(tag, callback) {
        var zuordnung = {
            probeId: this.pId,
            tagId: tag
        };
        Ext.Ajax.request({
            url: this.proxy.url,
            method: 'POST',
            jsonData: zuordnung,
            callback: callback
        });
    },

    /**
     * Deletes a reference from the given tag to the current probe, using a DELETE request
     */
    deleteZuordnung: function(tag, callback) {
        Ext.Ajax.request({
            url: this.proxy.url,
            method: 'DELETE',
            jsonData: {
                probeId: this.pId,
                tagId: tag
            },
            callback: callback
        });
    },

    sync: function() {
        //TODO: 
    }
});