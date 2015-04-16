/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 */
Ext.define('Lada.view.window.FileUpload', {
    extend: 'Ext.window.Window',

    layout: 'hbox',

    file: null,

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

    abort: function(button) {
        var win = button.up('window');
        win.close();
    },

    fileSelected: function(input, file) {
        var item = Ext.create('Ext.ux.upload.Item', {
            fileApiObject: file[0]
        });
        this.fileInput.setValue(item.getName());
        this.file = item;
    },

    uploadFile: function(button) {
        var win = button.up('window');
        var uploader = Ext.create('Ext.ux.upload.uploader.ExtJsUploader', {
            extraHeaders: {
                'X-OPENID-PARAMS': Lada.openIDParams
            },
            method: 'POST',
            url: '/lada-server/import/laf'
        });
        this.mon(uploader, 'uploadsuccess', win.uploadSuccess, win);
        this.mon(uploader, 'uploadfailure', win.uploadFailure, win);
        console.log(button.up('window'));
        if (button.up('window').file !== null) {
            uploader.uploadItem(button.up('window').file);
        }
    },

    uploadSuccess: function() {
        this.close();
    },

    uploadFailure: function() {
        this.close();
    }
});
