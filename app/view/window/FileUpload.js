/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a simple Fileupload Window, used to upload LAF-Files
 */
Ext.define('Lada.view.window.FileUpload', {
    extend: 'Ext.window.Window',
    requires: ['Lada.view.window.ImportResponse'],

    layout: 'hbox',

    file: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var me = this;
        this.browseButton = Ext.create('Ext.ux.upload.BrowseButton', {
            buttonText: 'Durchsuchen...',
            margin: '3, 3, 3, 3'
        });
        this.fileInput = Ext.create('Ext.form.field.Text', {
            allowBlank: false,
            emptyText: 'Wählen Sie eine Datei',
            hideLabel: true,
            margin: '3, 3, 3, 3'
        });
        this.items = [
            this.fileInput,
            this.browseButton
        ];
        this.buttons = [{
            text: 'Speichern',
            handler: this.uploadFile
        }, {
            text: 'Abbrechen',
            handler: this.abort
        }];
        this.on('afterrender', function() {
            this.browseButton.fileInputEl.dom.removeAttribute('multiple', '0');
        }, this);
        this.browseButton.on('fileselected', this.fileSelected, this);
        this.callParent(arguments);
    },

    /**
     * @private
     * A handler for a Abort-Button
     */
    abort: function(button) {
        var win = button.up('window');
        win.close();
    },

    /**
     * @private
     * A handler for the Input field
     */
    fileSelected: function(input, file) {
        var item = Ext.create('Ext.ux.upload.Item', {
            fileApiObject: file[0]
        });
        this.fileInput.setValue(item.getName());
        this.file = item;
    },

    /**
     * @private
     * A handler for the Upload-Button
     */
    uploadFile: function(button) {
        // TODO Error handling ?
        var win = button.up('window');
        var uploader = Ext.create('Ext.ux.upload.uploader.ExtJsUploader', {
            extraHeaders: {
                'X-OPENID-PARAMS': Lada.openIDParams
            },
            method: 'POST',
            timeout: 600 * 1000,
            url: 'lada-server/data/import/laf'
        });
        this.mon(uploader, 'uploadsuccess', win.uploadSuccess, win);
        this.mon(uploader, 'uploadfailure', win.uploadFailure, win);
        if (button.up('window').file !== null) {
            uploader.uploadItem(button.up('window').file);
            win.setLoading(Lada.getApplication().bundle.getMsg('processingData'));
        }
    },

    /**
     * @private
     */
    uploadSuccess: function(file, response) {
        this.close();
        var win = Ext.create('Lada.view.window.ImportResponse', {
            data: response.response.responseText,
            message: response.message,
            fileName: file.config.fileApiObject.name,
            title: 'Importergebnis'
        });
        win.show();
    },

    /**
     * @private
     */
    uploadFailure: function(file, response) {
        // TODO handle Errors correctly, especially AuthenticationTimeouts
        this.close();
        var win = Ext.create('Lada.view.window.ImportResponse', {
            data: response.response.responseText,
            message: response.message,
            fileName: file.config.fileApiObject.name,
            title: 'Importergebnis'
        });
        win.show();
    }
});
