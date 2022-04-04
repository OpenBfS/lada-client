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
    //Probe ids used for filtering for selected tags
    pId: null,
    //Messung ids used for filtering for selected tags
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
     * @param ids list of IDs to use. If several ids are given, the display
     * will show the tags shared by all ids
     * @param recordType 'probe' or 'messung'
     */
    // TODO further tests
    setTagged: function(ids, recordType) {
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
                this.mId = ids;
                this.assignedTagsStore.proxy.url =
                    'lada-server/rest/tag?' + 'mid=' + this.mId.join('&mid=');
                break;
            case 'probe':
                this.pId = ids;
                this.mId = null;
                this.assignedTagsStore.proxy.url =
                    'lada-server/rest/tag?' + 'pid=' + this.pId.join('&pid=');
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
    },

    /**
     * Check if a tag with the given name already exists.
     * @param {String} tagName Tagname to check
     * @param {Integer} id (optional) don't return true if the only match is
     * the tag with the given id
     * @return {Boolean} true if a tag with the given name exists
     */
        tagExists: function(tagName, id) {
            var store = Ext.data.StoreManager.get('tags');
            if (id === undefined) {
            //Find record: case sensitive and exact match
            return store.find('tag', tagName, 0, false, true, true) > -1;
        } else {
            return store.findBy(function(obj){
                return obj.get('tag') === tagName && obj.get('id') !== id;
            });
        }
    }
});
