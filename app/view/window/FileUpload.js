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

    fileInput: null,

    encodingSelector: null,

    file: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var me = this;
        this.fileInput = Ext.create('Ext.form.field.File', {
            fieldLabel: 'Wählen Sie eine Datei',
            labelAlign: 'top',
            allowBlank: false,
            buttonText: 'Durchsuchen...',
            width: 240,
            margin: '3 3 3 3'
        });
        this.encodingSelector = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Encoding',
            labelAlign: 'top',
            allowBlank: false,
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
        var buttons = [{
            xtype: 'button',
            text: 'Speichern',
            margin: '3, 3, 3, 3',
            handler: this.readFile
        }, {
            xtype: 'button',
            text: 'Abbrechen',
            margin: '3, 3, 3, 3',
            handler: this.abort
        }];
        var buttonPanel = Ext.create('Ext.container.Container', {
            layout: 'hbox',
            items: buttons
        });

        me.items = [this.fileInput, this.encodingSelector, buttonPanel];
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
     * A handler for the Uploade-Button, reading the file specified in the form field
     */
    readFile: function(button) {
        var me = this;
        var win = button.up('window');
        var cb = win.down('combobox');
        var file = win.fileInput.fileInputEl.dom.files[0];
        win.file = file;
        console.log(file);
        var reader = new FileReader();
        reader.onload = function() {
            var binData = reader.result;
            win.uploadFile(button, binData);
        };
        reader.readAsBinaryString(file);
    },

    /**
     * @private
     * A handler uploading a file, given as binary string
     */
    uploadFile: function(button, binData) {
        var win = button.up('window');
        var cb = win.down('combobox');
        var contentType = 'text/plain; charset=' + cb.getValue();
        Ext.Ajax.request({
            url: 'lada-server/data/import/laf',
            method: 'POST',
            headers: {
                'Content-Type': contentType
            },
            scope: win,
            rawData: binData,
            success: win.uploadSuccess,
            failure: win.uploadFailure
        });
    },

    /**
     * @private
     */
    uploadSuccess: function(response, opts) {
        this.close();
        console.log(response.responseText);
        console.log(response);
        var win = Ext.create('Lada.view.window.ImportResponse', {
            responseData: response.responseText,
            message: '', //TODO:response.message,
            modal: true,
            fileName: this.file.name,
            title: 'Importergebnis'
        });
        win.show();
    },

    /**
     * @private
     */
    uploadFailure: function(response, opts) {
        // TODO handle Errors correctly, especially AuthenticationTimeouts
        this.close();
        console.log(response);
        console.log(opts);
        var win = Ext.create('Lada.view.window.ImportResponse', {
            responseData: response.responseText,
            message: '',//TODO:response.responseText.message,
            fileName: this.file.name,
            title: 'Importergebnis'
        });
        win.show();
    }
});
