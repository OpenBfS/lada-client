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
    //Probe id used for filtering for selected tags
    mId: null,

    /**
     * Function to call after this or the assigned store finished loading
     */
    loadingCallback: null,


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
     * Set the probe or messung ID as a filter param to get assigned tags
     * @param id ID to use
     * @param recordType 'probe' or 'messung'
     */
    // TODO allow list of ids
    setTagged: function(id, recordType) {
        if (!this.assignedTagsStore) {
            this.assignedTagsStore = Ext.create('Lada.store.Tag', {
                autoLoad: false
            });
        }
        if (this.loadingCallback) {
            this.assignedTagsStore.on('load', this.loadingCallback);
        }
        switch (recordType) {
            case 'messung':
                this.pId = null;
                this.mId = id;
                this.assignedTagsStore.proxy.extraParams = {
                    mid: id
                };
                break;
            case 'probe':
                this.pId = id;
                this.mId = null;
                this.assignedTagsStore.proxy.extraParams = {
                    pid: id
                };
                break;
            default:
                Ext.raise('Unkown record type: ' + recordType);
        }
    },

    /**
     * Set the callback after loading finished.
     * Should be used instead of on
     * @param {Object} callbackFunction Function to use as callback
     */
    setLoadingCallback: function(callbackFunction) {
        this.loadingCallback = callbackFunction;
        this.on('load', callbackFunction);
        if (this.assignedTagsStore) {
            this.assignedTagsStore.on('load', callbackFunction);
        }
    },

    /**
     * Loads the store holding tags assigned to the current Probe or Messung,
     * if it exists.
     * After loading the callback is executed.
     * @param {*} scope Callback scope
     * @param {*} callback Callback function
     */
    loadAssignedTags: function(scope, callback) {
        if (this.assignedTagsStore) {
            this.assignedTagsStore.load({
                scope: scope,
                callback: callback
            });
        }
    },

    failureHandler: function() {
        var i18n = Lada.getApplication().bundle;
        Ext.Msg.alert(
            i18n.getMsg('tag.widget.err.genericsavetitle'),
            i18n.getMsg('tag.widget.err.genericsave'));
    }
});
