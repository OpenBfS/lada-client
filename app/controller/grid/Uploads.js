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
    downloadPath: 'result/',

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
    onSaveItem: function(record) {
        if (record.get('resultFetched') === false) {
            var me = this;
            var url = this.urlPrefix + this.downloadPath + record.get('refId');
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
    },

    /**
     * @private
     * A handler for the Upload-Button, reading the file specified in the
     * form field
     */
    readFiles: function(button) {
        var me = this;
        var win = button.up('panel');
        var fileInput = win.down('filefield');
        var files = fileInput.fileInputEl.dom.files;
        var readers = new Array(files.length);
        if (readers.length === 0) {
            return;
        }
        win.files = files;
        win.fileNames = [];
        var binFiles = {};
        var filesRead = 0;
        win.fileCount = files.length;
        for (var i = 0; i < files.length; i++) {
            win.fileNames[i] = files[i].name;
            var file = files[i];
            readers[i] = new FileReader();
            readers[i].fileName = files[i].name;
            // eslint-disable-next-line no-loop-func
            readers[i].onload = function(evt) {
                var binData = evt.target.result;
                //Remove mime type and save to array
                binFiles[evt.target.fileName] = binData.split(',')[1];
                filesRead++;
                if (filesRead === files.length) {
                    me.uploadFiles(button, binFiles);
                }
            };
            readers[i].readAsDataURL(file);
        }
    },

    /**
     * Upload a list of files to the import service
     * @param {Ext.button.Button} button Button that triggered the upload event
     * @param {Object} binFiles Object containing file name as keys and file
     * content as value
     */
    uploadFiles: function(button, binFiles) {
        var win = button.up('panel');
        var cb = win.down('combobox[name=encoding]');

        var queueItem = this.addQueueItem(win.fileNames);
        queueItem.set(
            'encoding', win.down('combobox[name=encoding]').getValue());
        queueItem.set('measFacilId', win.down('combobox[name=mst]').getValue());
        Ext.Ajax.request({
            url: 'lada-server/data/import/async/laf',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            scope: win,
            jsonData: {
                files: binFiles,
                encoding: cb.getValue(),
                measFacilId: queueItem.get('measFacilId')
            },
            success: function(response) {
                var json = Ext.decode(response.responseText);
                queueItem.set('refId', json.refId);
                queueItem.set('status', 'waiting');
                queueItem.set('message', '' );
                if (json.error) {
                    queueItem.set('message', json.error );
                    queueItem.set('status', 'error');
                }
            },
            failure: function(response, opts) {
                queueItem.set('status', 'error');
                var msg = win.controller.handleRequestFailure(
                    response, opts, null, true);
                if (response.status === 502 || response.status === 413) {
                    // correct status for an expected "file too big" would be
                    // 413, needs server adaption, 502 could be something else
                    msg = 'importResponse.failure.server.bigfile';
                }
                queueItem.set('message', Lada.util.I18n.getMsgIfDefined(msg));
                queueItem.set('done', true);
            }
        });
    }
});
