/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a the Fileupload panel, used to upload LAF-Files
 */
Ext.define('Lada.view.panel.FileUpload', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.field.File',
        'Lada.view.grid.UploadQueue',
        'Lada.view.window.ImportResponse',
        'Lada.controller.grid.Uploads'
    ],
    alias: 'widget.fileupload',

    controller: 'upload',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    margin: '10',

    files: null,
    fileNames: null,

    filesUploaded: 0,

    resultWin: null,

    width: 350,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [
            Ext.create('Ext.form.field.File', {
                fieldLabel: i18n.getMsg('selectfile'),
                allowBlank: false,
                labelWidth: '30%',
                buttonText: i18n.getMsg('search'),
                buttonOnly: true,
                listeners: {
                    //Allow multiple files
                    afterRender: function(cmp) {
                        if (!cmp.fileInputEl) {
                            return;
                        }
                        cmp.fileInputEl.dom.setAttribute(
                            'multiple', 'multiple');
                    },
                    //Remove 'C:\Fakepath' part of filenames
                    change: function(field) {
                        if (!field.fileInputEl) {
                            return;
                        }
                        var node = Ext.DomQuery.selectNode(
                            'input[id=' + field.getInputId() + ']');
                        var files = field.fileInputEl.dom.files;
                        var fileNames = '';
                        var fset = field.up('panel').down('fieldset');
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
                            i18n.getMsg('import.filesSelected', files.length));
                        node.value = fileNames;
                        if (
                            (field.up('panel').down('combobox[name=mst]')
                                .isValid()) &&
                            (files.length !== 0)
                        ) {
                            field.up('panel').down(
                                'button[name=save]').setDisabled(false);
                        } else {
                            field.up('panel').down(
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
                labelAlign: 'top',
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
                displayField: 'name',
                valueField: 'id',
                fieldLabel: i18n.getMsg('vorbelegung'),
                labelAlign: 'top',
                allowBlank: false,
                matchFieldWidth: false,
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function() {
                            this.up('panel').down('button[name=save]')
                                .setDisabled(true);
                            this.clearValue();
                        }
                    }
                },
                listeners: {
                    afterRender: function(combo) {
                        if (combo.getStore().getCount() === 1) {
                            var recordSelected = combo.getStore().getAt(0);
                            combo.setValue(recordSelected);
                        }
                    },
                    select: function(combo) {
                        if (combo.up('panel').down('filefield').isValid()) {
                            combo.up('panel').down('button[name=save]')
                                .setDisabled(false);
                        }
                    }
                }
            }),
            Ext.create('Lada.view.grid.UploadQueue', {
                store: Ext.getStore('uploadqueue'),
                width: '100%',
                height: 150,
                margin: 3
            }),
            Ext.create('Ext.container.Container', {
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    text: i18n.getMsg('save'),
                    name: 'save',
                    margin: '3, 3, 3, 3',
                    disabled: true,
                    handler: 'readFiles'
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
        this.title = i18n.getMsg('title.dataimport');
        this.clear();
    },

    /**
     * @private
     * A handler for a Abort-Button
     */
    abort: function(button) {
        var win = button.up('panel');
        win.clear();
    },

    clear: function() {
        var uploader = this.down('fileuploadfield');
        uploader.reset();
        uploader.fireEvent('change', uploader);
        uploader.fireEvent('afterRender', uploader);
        this.down('button[name=save]').setDisabled(true);
    }
});
