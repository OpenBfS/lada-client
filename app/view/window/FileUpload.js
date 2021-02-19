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
                        cmp.fileInputEl.dom.setAttribute(
                            'multiple', 'multiple');
                    },
                    //Remove 'C:\Fakepath' part of filenames and show a comma
                    //separated list to increase readability
                    change: function(field) {
                        var node = Ext.DomQuery.selectNode(
                            'input[id='+ field.getInputId() + ']');
                        var files = field.fileInputEl.dom.files;
                        var fileNames = '';
                        var fset = field.up('window').down('fieldset');
                        fset.removeAll();
                        for (var i = 0; i < files.length; i++) {
                            var fname = files[i].name.replace(
                                'C:\\fakepath\\', '');
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
                        fset.setTitle(
                            i18n.getMsg('import.filesSelected',files.length));
                        node.value = fileNames;
                        if (
                            (field.up('window').down('combobox[name=mst]')
                                .isValid()) &&
                            (files.length !== 0)
                        ) {
                            field.up('window').down(
                                'button[name=save]').setDisabled(false);
                        } else {
                            field.up('window').down(
                                'button[name=save]').setDisabled(true);
                        }
                    }
                }
            }),
            {
                xtype: 'fieldset',
                name: 'uploadFiles',
                collapsible: true,
                margin: '5 5 5 5',
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
                allowBlank: false,
                matchFieldWidth: false,
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function() {
                            this.up('window').down('button[name=save]')
                                .setDisabled(true);
                            this.clearValue();
                        }
                    }
                },
                listeners: {
                    afterrender: function(combo) {
                        if (combo.getStore().getCount() === 1) {
                            var recordSelected = combo.getStore().getAt(0);
                            combo.setValue(recordSelected);
                        }
                    },
                    select: function(combo) {
                        if (combo.up('window').down('filefield').isValid()) {
                            combo.up('window').down('button[name=save]')
                                .setDisabled(false);
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
                    name: 'save',
                    margin: '3, 3, 3, 3',
                    disabled: true,
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
     * A handler for the Upload-Button, reading the file specified in the
     * form field
     */
    readFiles: function(button) {
        var win = button.up('window');
        win.setLoading(true);
        var fileInput = win.down('filefield');
        var files = fileInput.fileInputEl.dom.files;
        var readers = new Array(files.length);
        if (readers.length === 0) {
            win.setLoading(false);
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
                    win.uploadFiles(button, binFiles);
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
        var win = button.up('window');
        var cb = win.down('combobox[name=encoding]');
        var mstSelector = win.down('combobox[name=mst]').getValue();

        if (cb.getValue() === 'utf-8') {
            Ext.Object.each(binFiles, function(fileName, fileContent) {
                var x = new Uint8Array(fileContent.slice(0,3));
                if (
                    x[0] === 0xEF &&
                    x[1] === 0xBB &&
                    x[2] === 0xBF
                ) {
                    fileContent = fileContent.slice(3);
                }
            });
        }
        Ext.Ajax.request({
            url: 'lada-server/data/import/laf/list',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-LADA-MST': mstSelector
            },
            scope: win,
            jsonData: {
                files: binFiles,
                encoding: cb.getValue()
            },
            success: function(response, opts) {
                win.uploadSuccess(response, opts);
            },
            failure: function(response) {
                //If request fails show an alert
                var i18n = Lada.getApplication().bundle;
                var msg = 'importResponse.failure.server.multi';
                // TODO: correct status for an expected "file too big" would be
                // 413, needs server adaption, 502 could be something else, too
                if (response.status === 502) {
                    msg = 'importResponse.failure.server.bigfile';
                }
                Ext.Msg.show({
                    message: i18n.getMsg(msg),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
                win.setLoading(false);
            }
        });
    },

    /**
     * @private
     * Show result window after successfull uploaded
     */
    uploadSuccess: function(response) {
        this.filesUploaded++;
        var i18n= Lada.getApplication().bundle;
        var responseText = response.responseBytes ?
            String.fromCharCode.apply(null, response.responseBytes):
            response.responseText;
        var responseJson = Ext.JSON.decode(responseText, true);
        if (!responseJson) {
            // TODO: Handle SSO HTML form like in RestProxy.processResponse
            Ext.Msg.show({
                message: i18n.getMsg('importResponse.failure.server.multi'),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
            this.setLoading(false);
            return;
        }
        var tag = '';
        //Get the generated tag name
        if (Object.keys(responseJson.data).length > 0) {
            var firstImport = Object.keys(responseJson.data)[0];
            tag = responseJson.data[firstImport].tag;
        }
        if (!this.resultWin) {
            this.resultWin = Ext.create('Lada.view.window.ImportResponse', {
                modal: true,
                fileCount: this.fileCount,
                fileNames: this.fileNames,
                response: responseJson,
                encoding: this.down('combobox[name=encoding]').getValue(),
                mst: this.down('combobox[name=mst]').getValue(),
                width: 500,
                height: 350,
                title: i18n.getMsg('title.importresult', tag)
            });
            //Show result, reload grid, close this window
            this.resultWin.show();
            var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
            if (parentGrid.length === 1) {
                parentGrid[0].reload();
            }
            this.close();
        }
    },

    /**
     * @private
     * Handler if an import request failed
     */
    uploadFailure: function(response, opts, fileIndex) {
        // TODO handle Errors correctly, especially AuthenticationTimeouts
        var i18n= Lada.getApplication().bundle;
        this.filesUploaded++;

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

        this.resultWin.updateOnError(
            response.status, response.statusText, fileIndex);

        if (this.filesUploaded === this.files.length) {
            this.resultWin.finishedHandler();
            this.close();
        }
    }
});
