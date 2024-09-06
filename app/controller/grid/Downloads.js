/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the DownloadQueue actions: adding, removing, occasional
 * updates
 */
Ext.define('Lada.controller.grid.Downloads', {
    extend: 'Lada.controller.grid.Queue',
    alias: 'controller.download',

    ladaPrintUrlPrefix: 'lada-printer/print/',

    resultUrl: 'lada-server/data/asyncexport/download/',
    statusUrl: 'lada-server/data/asyncexport/status/',

    /**
     * Initialize the controller
     */
    init: function() {
        this.control({
            'exportdata checkbox[name=allrows]': {
                change: this.setExportButtonDisabled
            },
            'exportdata combobox[name=formatselection]': {
                change: this.setExportButtonDisabled
            }
        });

        this.callParent(arguments);
    },

    setExportButtonDisabled: function(item) {
        var win = item.up('window');
        win.down('button[action=export]').setDisabled(
            !win.down('form').isValid()
            || !win.grid.getSelectionModel().getSelection().length
            && (win.down('combobox[name=formatselection]').getValue() === 'laf'
                || !win.down('checkbox[name=allrows]').getValue()));
    },

    /**
     * Add an entry to the downloadqueue.
     * @param filename: The name used to save results
     * @returns reference to the model item
     */
    addQueueItem: function(filename) {
        var storeItem = Ext.create('Lada.model.DownloadQueue', {
            type: 'export',
            filename: filename,
            startDate: new Date().valueOf(),
            status: 'preparation',
            done: false,
            autodownload: false
        });
        Ext.data.StoreManager.get('downloadqueue-export').add(storeItem);
        return storeItem;
    },

    /**
     * Cancels the mapfish creation of a queued DownloadQueue item
     * @param {*} model
     */
    onCancelItem: function(model) {
        var type = model.get('type');

        var ref = model.get('refId');
        if (ref && type === 'lada-print') {
            Ext.Ajax.request({
                url: this.ladaPrintUrlPrefix + 'cancel/' + ref,
                method: 'DELETE',
                failure: this.handleRequestFailure
            });
        } else if (type === 'laf') {
            // LAF export offers no server side cancelling API. This just stops
            // caring about some future answer
            this.callParent(arguments);
        }
    },

    /**
     * Retrieves a finished item to DownloadQueue Item and saves it to disk
     * @param {*} model
     */
    onSaveItem: function(model) {
        // potentially submits wrong prefix part if url is proxied:
        // var url = model.get('downloadURL');
        var type = model.get('type');
        var url;
        switch (type) {
            case 'lada-print':
                url = this.ladaPrintUrlPrefix + 'report/' + model.get('refId');
                break;
            case 'export':
                url = this.resultUrl + model.get('refId');
                break;
        }
        if (url) {
            model.set('downloadRequested', true);
            var me = this;
            Ext.Ajax.request({
                url: url,
                method: 'GET',
                headers: {
                    Accept: 'application/octet-stream'
                },
                binary: true,
                timeout: 60000,
                success: function(response) {
                    var content = response.responseBytes;
                    var filetype = response.getResponseHeader('Content-Type');
                    var blob = new Blob([content], {type: filetype});
                    saveAs(blob, model.get('filename'));
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
        }
    },

    /**
     * Tries to refresh all queued item info.
     */
    refreshQueue: function() {
        // this should be done only once, but after initialization
        // (after app.js: GET appContext.json finished)
        if (Lada.appContext && Lada.appContext.merge.urls['print-servlet']) {
            this.ladaPrintUrlPrefix = Lada.appContext.merge.urls[
                'print-servlet'];
        }
        var store0 = Ext.data.StoreManager.get('downloadqueue-print');
        var store1 = Ext.data.StoreManager.get('downloadqueue-export');
        var me = this;
        if (store0) {
            Ext.each(store0.getData().items, function(item) {
                me.refreshItemInfo(item);
            });
        }
        if (store1) {
            Ext.each(store1.getData().items, function(item) {
                me.refreshItemInfo(item);
            });
        }
    },

    /**
     * Polls the status of a queue item
     * @param {*} item Lada.model.DownloadQueue instance
     */
    refreshItemInfo: function(item) {
        // potentially submits wrong prefix part if url is proxied
        // var url = item.get('mapfish_statusURL');
        var refId = item.get('refId');
        if (refId && !item.get('done')) {
            var url;
            switch (item.get('type')) {
                case 'lada-print':
                    url = this.ladaPrintUrlPrefix + '/status/' + refId + '.json';
                    break;
                case 'export':
                    url = this.statusUrl + refId;
                    break;
            }
            var me = this;
            return new Ext.Promise(function() {
                Ext.Ajax.request({
                    url: url,
                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        // save to disk if autodownload is true.
                        if ( item.status !== 'finished' &&
                            json.status === 'finished' &&
                            item.get('autodownload') === true &&
                            item.get('downloadRequested') === false) {
                            me.onSaveItem(item);
                        }
                        item.set('done', json.done);
                        item.set('status', json.status);
                        item.set('downloadURL', json.downloadURL || null);
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

                        var msg = response.responseText;
                        if (!msg) {
                            var i18n = Lada.getApplication().bundle;
                            msg = response.timedout
                                ? i18n.getMsg('err.msg.timeout')
                                : response.statusText;
                        }
                        item.set('message', msg);
                    }
                });
            });
        }
    }
});
