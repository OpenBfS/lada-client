/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

// TODO: functionality to delete all finished/all errors
// TODO: better visual feedback in print window and queue icon

/**
 * Controller for the DownloadQueue actions: adding, removing, occasional
 * updates
 */
Ext.define('Lada.controller.grid.Downloads', {
    extend: 'Ext.app.Controller',
    record: null,
    printUrlPrefix: 'lada-printer/print/',

    /**
     * Initialize the controller
     */
    init: function() {
        // request polling every 2 seconds
        window.setInterval(this.refreshQueue, 2000);
    },

    /**
     * Cancels the mapfish creation of a queued DownloadQueue item
     * @param {*} model
     */
    onCancelItem: function(model) {
        var ref = model.get('refId');
        if (ref) {
            Ext.Ajax.request({
                url: this.printUrlPrefix + 'cancel/' + ref,
                method: 'DELETE',
                callback: this.refreshQueue
            });
        }
    },

    /**
     * Deletes an old entry from queue
     * @param {*} model
     */
    onDeleteItem: function(model) {
        if (model.get('done') === true) {
            Ext.data.StoreManager.get('downloadqueue').remove(model);
        }
    },

    /**
     * Retrieves a finished item to DownloadQueue Item and saves it to disk
     * @param {*} model
     */
    onSaveItem: function(model) {
        // potentially submits wrong prefix part if url is proxied:
        // var url = model.get('downloadURL');
        var url = this.printUrlPrefix + 'report/' + model.get('refId');
        model.set('downloadRequested', true);
        var me = this;
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            binary: true,
            timeout: 60000,
            success: function(response) {
                var content = response.responseBytes;
                var filetype = response.getResponseHeader('Content-Type');
                /* eslint-disable no-undef */
                var blob = new Blob([content],{type: filetype});
                saveAs(blob, model.get('filename'));
                model.set('downloadRequested', false);
                /* eslint-enable no-undef */
                me.refreshQueue();
            },
            failure: function(error) {
                model.set('status', 'error');
                // sets more of a debug info. Needs end user readability why
                // download failed.
                model.set('message', error.error);
                me.refreshQueue();
            }
        });
    },

    /**
     * Tries to refresh all queued item info
     */
    refreshQueue: function() {
        // this should be done only once, but after initialization
        // (after app.js: GET appContext.json finished)
        if (Lada.appContext && Lada.appContext.merge.urls['print-servlet']) {
            this.printUrlPrefix = Lada.appContext.merge.urls['print-servlet'];
        }
        var store = Ext.data.StoreManager.get('downloadqueue');
        var controller = Lada.app.getController('Lada.controller.grid.Downloads');
        Ext.each(store.getData().items, function(item) {
            if (item.get('done') !== true) {
                controller.refreshItemInfo(item);
            }
        });
    },

    /**
     * Polls the status of an queue item
     * @param {*} item Lada.model.DownloadQuque instance
     */
    refreshItemInfo: function(item) {
        // potentially submits wrong prefix part if url is proxied
        // var url = item.get('mapfish_statusURL');
        var url = this.printUrlPrefix + '/status/' + item.get('refId') + '.json';
        if (url) {
            var me = this;
            return new Ext.Promise(function() {
                Ext.Ajax.request({
                    url: url,
                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        // save to disk if autodownload is set
                        if ( item.status !== 'finished' &&
                            json.status === 'finished' &&
                            item.get('autodownload') === true &&
                            item.get('downloadRequested') === false) {
                            me.onSaveItem(item);
                        }
                        item.set('done', json.done);
                        item.set('status', json.status);
                        item.set('downloadURL', json.downloadURL);
                        if (json.message) {
                            item.set('message', json.message);
                        } else {
                            if (json.error) {
                                item.set('message', json.error);
                            } else {
                                item.set('message', '');
                            }
                        }
                    },
                    failure: function(response) {
                        item.set('done', true);
                        item.set('status', 'error');
                        if (response.status === 404) {
                            item.set('status', 'URL not found');
                            // remove print jobs with URL not found (e.g. expired link)
                            // Ext.data.StoreManager.get('downloadqueue').remove(item);
                        } else {
                            // remove print jobs with URL not found.
                            item.set('message', 'bad server answer');
                            // Ext.data.StoreManager.get('downloadqueue').remove(item);
                        }
                    }
                });
            });
        }
    }
});
