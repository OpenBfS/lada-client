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
        'Ext.form.field.File',
        'Lada.view.window.ImportResponse'
    ],

    layout: 'vbox',

    file: null,

    defaults: {
        maxWidth: 240,
        width: 240,
        labelAlign: 'top'
    },
    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [
            Ext.create('Ext.form.field.File', {
                fieldLabel: i18n.getMsg('selectfile'),
                allowBlank: false,
                buttonText: i18n.getMsg('search'),
                margin: '3 3 3 3'
            }),
            Ext.create('Ext.form.field.ComboBox', {
                fieldLabel: i18n.getMsg('encoding'),
                allowBlank: false,
                displayField: 'name',
                valueField: 'value',
                name: 'encoding',
                valueNotFoundText: i18n.getMsg('notfound'),
                margin: '3, 3, 3, 3',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [{
                        name: 'ISO-8859-15',
                        value: 'iso-8859-15'
                    }, {
                        name: 'UTF-8',
                        value: 'utf-8'
                    }, {
                        name: 'IBM437',
                        value: 'ibm437'
                    }]
                })
            }),
            Ext.create('Ext.form.field.ComboBox', {
                store: Ext.data.StoreManager.get('messstellenFiltered'),
                name: 'mst',
                margin: '3, 3, 3, 3',
                displayField: 'messStelle',
                valueField: 'id',
                fieldLabel: i18n.getMsg('vorbelegung'),
                allowBlank: true,
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function() {
                            this.clearValue();
                        }
                    }
                }
            }),
            Ext.create('Ext.container.Container', {
                flex: 1,
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    text: i18n.getMsg('save'),
                    margin: '3, 3, 3, 3',
                    handler: this.readFile
                }, {
                    xtype: 'button',
                    text: i18n.getMsg('cancel'),
                    margin: '3, 3, 3, 3',
                    handler: this.abort
                }]
            })
        ];
        this.callParent(arguments);
        var encoding = document.characterSet;
        if (!encoding) {
            encoding = document.defaultCharset;
        }
        this.down('combobox[name=encoding]').setValue(encoding.toLowerCase());
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
     * A handler for the Upload-Button, reading the file specified in the form field
     */
    readFile: function(button) {
        var win = button.up('window');
        var fileInput = win.down('filefield');
        var file = fileInput.fileInputEl.dom.files[0];
        if (!file) {
            //TODO error handling
            return;
        }
        win.file = file;
        var reader = new FileReader();
        reader.onload = function() {
            var binData = reader.result;
            win.uploadFile(button, binData);
        };
        reader.readAsArrayBuffer(file);
    },

    /**
     * @private
     * A handler uploading a file, given as binary string
     */
    uploadFile: function(button, binData) {
        var win = button.up('window');
        var cb = win.down('combobox[name=encoding]');
        var contentType = 'text/plain; charset=' + cb.getValue();
        var mstSelector = win.down('combobox[name=mst]').getValue();
        Ext.Ajax.request({
            url: 'lada-server/data/import/laf',
            method: 'POST',
            headers: {
                'Content-Type': contentType,
                'X-LADA-MST': mstSelector
            },
            scope: win,
            binary: true,
            binaryData: binData,
            success: win.uploadSuccess,
            failure: win.uploadFailure
        });
    },

    /**
     * @private
     */
    uploadSuccess: function(response, opts) {
        this.close();
        var i18n= Lada.getApplication().bundle;
        var responseText = response.responseBytes ?
                String.fromCharCode.apply(null, response.responseBytes):
                response.responseText;
        var win = Ext.create('Lada.view.window.ImportResponse', {
            responseData: responseText,
            message: '', //TODO:response.message,
            modal: true,
            fileName: this.file.name,
            title: i18n.getMsg('title.importresult')
        });
        win.show();
        var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
        if (parentGrid.length === 1) {
            parentGrid[0].reload();
        }
    },

    /**
     * @private
     */
    uploadFailure: function(response, opts) {
        // TODO handle Errors correctly, especially AuthenticationTimeouts
        var i18n= Lada.getApplication().bundle;
        this.close();
        var win = Ext.create('Lada.view.window.ImportResponse', {
            responseData: response.responseText,
            message: '',//TODO:response.responseText.message,
            fileName: this.file.name,
            title: i18n.getMsg('title.importresult')
        });
        win.show();
    }
});
