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
    extend: 'Lada.controller.grid.Queue',
    alias: 'controller.upload',

    store: 'uploadqueue',
    urlPrefix: 'lada-server/data/import/async/',

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
        var store = Ext.data.StoreManager.get(this.store);
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
            var url = this.urlPrefix + 'result/' + record.get('refId');
            Ext.Ajax.request({
                url: url,
                success: function(response) {
                    record.set('result', response);
                    record.set('resultFetched', true);
                    me.showResult(response, {
                        mst: record.get('measFacilId'),
                        encoding: record.get('encoding')
                    });

                    // Refresh tag store in order to add import tag
                    var store = Ext.data.StoreManager.get('tags');
                    if (store) {
                        store.reload();
                    }
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
