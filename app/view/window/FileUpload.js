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
    requires: [
        'Ext.ux.upload.BrowseButton',
        'Ext.ux.upload.Item',
        'Ext.ux.upload.uploader.ExtJsUploader',
        'Lada.view.window.ImportResponse'
    ],

    layout: 'auto',

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
        this.encodingSelector = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Encoding',
            displayField: 'name',
            valueField: 'value',
            margin: '3, 3, 3, 3',
            labelWidth: '94px',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                data: [{
                    name: 'UTF-8',
                    value: 'utf-8'
                }, {
                    name: 'ISO-8859-15',
                    value: 'iso-8859-15'
                }, {
                    name: 'IBM437',
                    value: 'ibm437'
                }]
            })
        });
        this.items = [{
            layout: 'hbox',
            border: 0,
            items: [
                this.fileInput,
                this.browseButton
            ]
        }, {
            border: 0,
            items: [
                this.encodingSelector
            ]
        }];
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
        var encoding = document.characterSet;
        if (!encoding) {
            encoding = document.defaultCharset;
        }
        this.encodingSelector.setValue(encoding.toLowerCase());
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
        var cb = win.down('combobox');
        var uploader = Ext.create('Lada.view.plugin.ExtJsUploader', {
            method: 'POST',
            timeout: 600 * 1000,
            url: 'lada-server/data/import/laf'
        });
        if (!cb.getValue()) {
            return;
        }
        uploader.extraContentType = cb.getValue();
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
            modal: true,
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
