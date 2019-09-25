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

    files: null,
    fileNames: null,

    filesUploaded: 0,

    resultWin: null,

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
                margin: '3 3 3 3',
                listeners: {
                    //Allow multiple files
                    afterRender: function(cmp) {
                        cmp.fileInputEl.dom.setAttribute('multiple', 'multiple');
                    },
                    //Remove 'C:\Fakepath' part of filenames and show a comma
                    //separated list to increase readability
                    change: function(field, value) {
                        var node = Ext.DomQuery.selectNode('input[id='+ field.getInputId() + ']');
                        var files = field.fileInputEl.dom.files;
                        var fileNames = '';
                        var fset = field.up('window').down('fieldset');
                        fset.removeAll();
                        for (var i = 0; i < files.length; i++) {
                            var fname = files[i].name.replace("C:\\fakepath\\", "");
                            fset.add({
                                xtype: 'textfield',
                                readOnly: true, 
                                width: '95%',
                                value: fname,
                                margin: '5,5,5,5'
                            });
                            fileNames += fname;
                            if (i < files.length - 1) {
                                fileNames += ', ';
                            }
                        }
                        fset.setTitle(i18n.getMsg('import.filesSelected', files.length));
                        node.value = fileNames;
                    }
                }
            }),
            {
                xtype: 'fieldset',
                name: 'uploadFiles',
                collapsible: true,
                title: i18n.getMsg('import.filesSelected', 0),
                items: [],
                scrollable: true,
                maxHeight: 200
            },
            Ext.create('Ext.form.field.ComboBox', {
                fieldLabel: i18n.getMsg('fileEncoding'),
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
                    handler: this.readFiles
                }, {
                    xtype: 'button',
                    text: i18n.getMsg('cancel'),
                    margin: '3, 3, 3, 3',
                    handler: this.abort
                }]
            })
        ];
        this.callParent(arguments);
        this.down('combobox[name=encoding]').setValue('iso-8859-15');
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
    readFiles: function(button) {
        var win = button.up('window');
        var fileInput = win.down('filefield');
        var files = fileInput.fileInputEl.dom.files;
        var readers = new Array(files.length);
        if (!files) {
            //TODO error handling
            return;
        }
        win.files = files;
        win.fileNames = [];
        var binFiles = [];
        var filesRead = 0;
        win.fileCount = files.length;
        for (var i = 0; i < files.length; i++) {
            win.fileNames[i] = files[i].name;
            var file = files[i];
            readers[i] = new FileReader();
            readers[i].onload = function(evt) {
                var binData = evt.target.result;
                binFiles.push(binData);
                filesRead++;
                if (filesRead == files.length) {
                    win.uploadFiles(button, binFiles);
                }
            };
            readers[i].readAsArrayBuffer(file);
        }
    },

    uploadFiles: function(button, binFiles) {
        var win = button.up('window');
        for (var i = 0; i < binFiles.length; i++) {
            win.uploadFile(button, binFiles[i], i);
        }
    },

    /**
     * @private
     * A handler uploading a file, given as binary string
     */
    uploadFile: function(button, binData, fileIndex) {
        var win = button.up('window');
        var cb = win.down('combobox[name=encoding]');
        var contentType = 'text/plain; charset=' + cb.getValue();
        var mstSelector = win.down('combobox[name=mst]').getValue();
        var x = new Uint8Array(binData.slice(0,3));
        if (cb.getValue() === "utf-8" && x[0] == 0xEF && x[1] == 0xBB && x[2] == 0xBF)
            binData = binData.slice(3);
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
                success: function(response, opts) {
                    win.uploadSuccess(response, opts, fileIndex);
                },
                failure: function(response, opts) {
                    win.uploadFailure(response, opts, fileIndex);
                }
            });
    },

    /**
     * @private
     */
    uploadSuccess: function(response, opts, fileIndex) {
        this.filesUploaded++;
        var i18n= Lada.getApplication().bundle;
        var responseText = response.responseBytes ?
                String.fromCharCode.apply(null, response.responseBytes):
                response.responseText;

        if (!this.resultWin) {
            this.resultWin = Ext.create('Lada.view.window.ImportResponse', {
                message: {}, //TODO:response.message,
                modal: true,
                fileCount: this.fileCount,
                fileNames: this.fileNames,
                encoding: this.down('combobox[name=encoding]').getValue(),
                mst: this.down('combobox[name=mst]').getValue(),
                width: 500,
                height: 350,
                title: i18n.getMsg('title.importresult'),
                finishedHandler: function() {
                    var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                    if (parentGrid.length === 1) {
                        parentGrid[0].reload();
                    }
                }
            });
            this.resultWin.show();
        }

        this.resultWin.updateOnSuccess(responseText, fileIndex);

        if (this.filesUploaded == this.files.length) {
            this.resultWin.finishedHandler();
            this.close();
        }
    },

    /**
     * @private
     */
    uploadFailure: function(response, opts, fileIndex) {
        // TODO handle Errors correctly, especially AuthenticationTimeouts
        var i18n= Lada.getApplication().bundle;
        this.filesUploaded++;
        if (this.filesUploaded == this.files.length) {
            this.close();
        }
        if (!this.resultWin) {
            this.resultWin = Ext.create('Lada.view.window.ImportResponse', {
                message: {}, //TODO:response.message,
                modal: true,
                fileCount: this.fileCount,
                fileNames: this.fileNames,
                encoding: this.down('combobox[name=encoding]').getValue(),
                mst: this.down('combobox[name=mst]').getValue(),
                width: 600,
                height: 400,
                title: i18n.getMsg('title.importresult'),
                finishedHandler: function() {
                    var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
                    if (parentGrid.length === 1) {
                        parentGrid[0].reload();
                    }
                }
            });
            this.resultWin.show();
        }

        this.resultWin.updateOnError(response.status, response.statusText, fileIndex);

        if (this.filesUploaded == this.files.length) {
            this.resultWin.finishedHandler();
            this.close();
        }
    }
});
