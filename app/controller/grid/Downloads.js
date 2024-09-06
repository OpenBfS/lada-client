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
    alias: 'controller.export',

    store: 'downloadqueue-export',
    urlPrefix: 'lada-server/data/asyncexport/',

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
            filename: filename,
            startDate: new Date().valueOf(),
            status: 'preparation',
            done: false
        });
        Ext.data.StoreManager.get(this.store).add(storeItem);
        return storeItem;
    },

    /**
     * Retrieves a finished item to DownloadQueue Item and saves it to disk
     * @param {*} model
     */
    onSaveItem: function(model) {
        model.set('downloadRequested', true);
        var me = this;
        Ext.Ajax.request({
            url: this.urlPrefix + 'download/' + model.get('refId'),
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
});
