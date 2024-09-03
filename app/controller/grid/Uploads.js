/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the UploadQueue actions: adding, removing, occasional
 * updates
 */
Ext.define('Lada.controller.grid.Uploads', {
    extend: 'Lada.controller.BaseController',
    alias: 'controller.upload',

    record: null,

    resultUrl: 'lada-server/data/import/async/result/',
    statusUrl: 'lada-server/data/import/async/status/',

    /**
     * Initialize the controller, request polling to run every 2 seconds
     */
    init: function() {
        window.setInterval(() => this.refreshQueue(), 2000);
    },

    /**
     * Cancels the mapfish creation of a queued DownloadQueue item
     * @param {*} model
     */
    onCancelItem: function(model) {
        model.set('done', true);
        model.set('status', 'cancelled');
    },

    /**
     * Deletes an old entry from queue
     * @param {*} model
     * @param store
     */
    onDeleteItem: function(model, store) {
        if (model.get('done') === true) {
            store.remove(model);
        }
    },

    /**
     * Tries to refresh all queued item info.
     */
    refreshQueue: function() {
        var store = Ext.getStore('uploadqueue');
        var me = this;
        Ext.each(store.getData().items, function(item) {
            if (item.get('done') !== true) {
                me.refreshItemInfo(item);
            }
        });
    },

    /**
     * Polls the status of an queue item
     * @param {*} item Lada.model.UploadQueue instance
     */
    refreshItemInfo: function(item) {
        var url;
        var refId = item.get('refId');
        url = this.statusUrl + refId;
        if (url && refId) {
            return new Ext.Promise(function() {
                Ext.Ajax.request({
                    url: url,
                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        item.set('done', json.done);
                        item.set('errors', json.errors);
                        item.set('warnings', json.warnings);
                        item.set('notifications', json.notifications);
                        item.set('status', json.status);
                        if (!json.error) {
                            if (json.message) {
                                item.set('message', json.message);
                            }
                        } else {
                            item.set('message', json.error);
                            item.set('status', 'error');
                        }
                        var store = Ext.data.StoreManager.get('tags');
                        if (store) {
                            store.reload();
                        }
                    },
                    failure: function(response) {
                        item.set('done', true);
                        item.set('status', 'error');
                        if (response.status === 404) {
                            item.set('message', 'URL not found');
                        } else {
                            item.set('message', 'bad server answer');
                        }
                        var store = Ext.data.StoreManager.get('tags');
                        if (store) {
                            store.reload();
                        }
                    }
                });
            });
        }
    },

    /**
     * Add an entry to the upload queue.
     * @param filenames: Array of file names used for the import
     * @returns reference to the model item
     */
    addQueueItem: function(filenames) {
        var storeItem = Ext.create('Lada.model.UploadQueue', {
            filename: filenames.join(','),
            startDate: new Date().valueOf(),
            status: 'preparation',
            resultFetched: false,
            done: false,
            warnings: false,
            errors: false,
            notifications: false
        });
        var store = Ext.data.StoreManager.get('uploadqueue');
        store.add(storeItem);
        return storeItem;
    },

    /**
     * Get the result of an import and show a result window
     * @param {Lada.model.UploadQueue} record UploadQueue record
     */
    getResult: function(record) {
        if (record.get('resultFetched') === false) {
            var me = this;
            var url = this.resultUrl + record.get('refId');
            Ext.Ajax.request({
                url: url,
                success: function(response) {
                    record.set('result', response);
                    record.set('resultFetched', true);
                    me.showResult(response, {
                        mst: record.get('measFacilId'),
                        encoding: record.get('encoding')
                    });
                }
            });
        } else {
            this.showResult(record.get('result'), {
                mst: record.get('measFacilId'),
                encoding: record.get('encoding')
            });
        }
    },

    showResult: function(response, options) {
        var win = Ext.create('Lada.view.window.ImportResponse', {
            response: response,
            height: 550,
            width: 450,
            mst: options.mst,
            encoding: options.encoding
        });
        win.show();
    }
});
