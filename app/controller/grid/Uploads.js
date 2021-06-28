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
    extend: 'Ext.app.Controller',
    record: null,

    resultUrl: 'lada-server/data/import/async/result/',
    statusUrl: 'lada-server/data/import/async/status/',

    /**
     * Initialize the controller, request polling to run every 2 seconds
     */
    init: function() {
        window.setInterval(this.refreshQueue, 2000);
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
        var controller = Lada.app.getController(
            'Lada.controller.grid.Uploads');
        var store = Ext.getStore('uploadqueue');
        Ext.each(store.getData().items, function(item) {
            if (item.get('done') !== true) {
                controller.refreshItemInfo(item);
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
                        item.set('status', json.status);
                        if (!json.error) {
                            if (json.message) {
                                item.set('message', json.message);
                            }
                        } else {
                            item.set('message', json.error);
                            item.set('status', 'error');
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
                    }
                });
            });
        }
    },

    /**
     * @private
     * Show result window after successfull uploaded
     */
    uploadSuccess: function(response) {
        // refresh parent grid
        // set to DONE
        this.filesUploaded++;
        var i18n = Lada.getApplication().bundle;
        var responseText = response.responseBytes ?
            String.fromCharCode.apply(null, response.responseBytes):
            response.responseText;
        var responseJson = Ext.JSON.decode(responseText);
        var tag = '';
        //Get the generated tag name
        if (Object.keys(responseJson.data).length > 0) {
            var firstImport = Object.keys(responseJson.data)[0];
            tag = responseJson.data[firstImport].tag;
        }
        if (!this.resultWin) {
            this.resultWin = Ext.create('Lada.view.window.ImportResponse', {
                modal: true,
                fileCount: this.fileCount,
                fileNames: this.fileNames,
                response: responseJson,
                encoding: this.down('combobox[name=encoding]').getValue(),
                mst: this.down('combobox[name=mst]').getValue(),
                width: 500,
                height: 350,
                title: i18n.getMsg('title.importresult', tag)
            });
            //Show result, reload grid, close this window
            this.resultWin.show();
            var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
            if (parentGrid.length === 1) {
                parentGrid[0].reload();
            }
            this.close();
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
            done: false
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
                    me.showResult(response);
                }
            });
        } else {
            this.showResult(record.get('result'));
        }
    },

    showResult: function(response) {
        var win = Ext.create('Lada.view.window.ImportResponse', {
            response: response,
            height: 550,
            width: 450
        });
        win.show();
    }
});
