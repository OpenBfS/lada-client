/* Copyright (C) 2024 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for queue actions: adding, removing, occasional updates
 */
Ext.define('Lada.controller.grid.Queue', {
    extend: 'Lada.controller.BaseController',

    statusUrlSuffix: '',
    downloadPath: '',

    /**
     * Polls the status of a queue item
     * @param {*} item Lada.model.DownloadQueue instance
     */
    refreshItemInfo: function(item) {
        var me = this;
        window.setTimeout(function() {
            Ext.Ajax.request({
                url: me.urlPrefix + 'status/'
                    + item.get('jobId') + me.statusUrlSuffix,
                success: function(response) {
                    var json = Ext.decode(response.responseText);
                    item.set(json);
                    if (json.error) {
                        item.set('message', json.error);
                        item.set('status', 'error');
                    }
                    if (!item.get('done')) {
                        me.refreshItemInfo(item);
                    }
                },
                failure: function(response, opts) {
                    item.set('done', true);
                    item.set('status', 'error');

                    item.set('message', me.handleRequestFailure(
                        response, opts, null, true));
                }
            });
        }, 2000);
    },

    /**
     * Retrieves a finished item to DownloadQueue Item and saves it to disk
     * @param {*} model
     */
    onSaveItem: function(model) {
        model.set('downloadRequested', true);
        Ext.Ajax.request({
            url: this.urlPrefix + this.downloadPath + model.get('jobId'),
            method: 'GET',
            headers: {
                Accept: 'application/octet-stream'
            },
            binary: true,
            timeout: 60000,
            scope: this,
            success: function(response) {
                var content = response.responseBytes;
                var filetype = response.getResponseHeader('Content-Type');
                var blob = new Blob([content], {type: filetype});
                saveAs(blob, model.get('filename'));
            },
            failure: function(response, opts) {
                model.set('status', 'error');
                model.set('message', this.handleRequestFailure(
                    response, opts, null, true));
            }
        });
    },

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
    }
});
