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

    loadAssignedTags: function(scope, callback) {
        this.assignedTagsStore.load({
            scope: scope,
            callback: callback
        });
    },

    createTag: function(tag, callback) {
        //TODO: implement
    },

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
        })

    },

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