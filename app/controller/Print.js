/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for print functionalities
 */
Ext.define('Lada.controller.Print', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.widget.DynamicGrid',
        'Lada.view.window.PrintGrid'
    ],

    printUrlPrefix: 'lada-printer/print/',

    init: function() {
        this.control({
            'button[action=print]': { // generic print button
                click: this.openPrintDialog
            },
            'printgrid button[action=doPrint]': { // print dialog 'print' button
                click: this.doPrint
            },
            'printgrid combobox[name=template]': {
                change: this.generateTemplateFields
            },
            'printgrid radio[name=variant]': {
                change: this.changeVariant
            }
        });
    },

    /**
     * Triggers a 'print' dialog from a grid, where further choices about
     * templates can be made
     */
    openPrintDialog: function( button ) {
        button.setDisabled(true);
        var win = Ext.create('Lada.view.window.PrintGrid', {
            parentGrid: Ext.ComponentQuery.query('dynamicgrid')[0] || null,
            listeners: {
                close: function() {
                    button.setDisabled(false);
                }
            }
        });
        this.getAvailableTemplates(win);
        win.show();
    },

    /**
     * enables/disables part of the form
     * (assumies being part of a change event)
     * @param {*} radiobutton the calling radio button
     * @param {*} newValue the new value of the radio button set
     * TODO: may become obsolete if "table printing" is implemented another way
     */
    changeVariant: function(radiobutton, newValue) {
        var win = radiobutton.up('printgrid');
        if (
            (radiobutton.id === 'radio_printtable' && newValue) ||
            (radiobutton.id !== 'radio_printtable' && !newValue)) {
            win.down('combobox[name=template]').setDisabled(true);
            win.down('fieldset[name=dynamicfields]').setHidden(true);
            win.down('button[action=doPrint]').setDisabled(false);
        } else {
            win.down('combobox[name=template]').setDisabled(false);
            win.down('fieldset[name=dynamicfields]').setHidden(false);
            if (win.down('combobox[name=template]').getValue()) {
                win.down('button[action=doPrint]').setDisabled(false);
            } else {
                win.down('button[action=doPrint]').setDisabled(true);
            }
        }
    },

    /**
     * Retrieves the capabilities object of a template
     * @param {String} template a string identifying the template
     *   (as fetched from mapfish print's app.json)
     * @param callbackFn function to be called after details have arrived
     */
    getTemplateParams: function(template, callbackFn) {
        var me = this;
        Ext.Ajax.request({
            url: me.printUrlPrefix + template + '/capabilities.json',
            success: function(response) {
                if (response.responseText) {
                    var json = Ext.decode(response.responseText);
                    if (json && json.app === template) {
                        callbackFn(json);
                    } else {
                        me.handleError(response);
                    }
                }
            },
            failure: function(response) {
                // TODO which callback here?
                me.handleError(response);
            }
        });
    },

    /**
     * Fetches the capabilities of a mapfish print template and fills the
     * dialog with fields that may have 'default' values to be printed if no
     * value is given by the actual data
     * @param combobox assuming this function is called by a change event
     * @param newValue the new value of the combobox
     */
    generateTemplateFields: function( combobox, newValue ) {
        var printButton = combobox.up('printgrid').down('button[action=doPrint]');
        printButton.setDisabled(true);
        var capabilityCallbackFn = function(capabilities) {
            combobox.up('printgrid').currentCapabilities = capabilities;
            var fieldset = combobox.up('printgrid').down(
                'fieldset[name=dynamicfields]');
            fieldset.removeAll();
            if (!capabilities) {
                return;
            }
            var layout = capabilities.layouts[0];
            // TODO ensure there is always one or allow selecting several layouts

            var i18n = Lada.getApplication().bundle;
            var items = [];
            items.push({
                xtype: 'displayfield',
                fieldLabel: i18n.getMsg('print.layout'),
                margin: '0, 5, 5, 5',
                labelWidth: 95,
                value: layout.name
            });
            var recursiveFields = function(attributes, indent) {
                var addToIndent = 5;
                var listofItems = [];
                for (var i = 0; i < attributes.length; i++) {
                    var item = {
                        xtype: attributes[i].type === 'DataSourceAttributeValue' ? 'displayfield' : 'textfield',
                        name: attributes[i].name,
                        margin: '0, ' + (indent + 5).toString() + ',5 ,5',
                        value: attributes[i].type === 'DataSourceAttributeValue' ? attributes[i].name : attributes[i].default
                    };
                    if (item.xtype !== 'displayfield') {
                        item.fieldLabel = attributes[i].name;
                        listofItems.push(item);
                    } else {
                        listofItems.push(item);
                        // TODO check if a clientParams always has attributes
                        listofItems = listofItems.concat(recursiveFields(attributes[i].clientParams.attributes, addToIndent + indent));
                    }
                }
                return listofItems;
            };
            fieldset.add(items.concat(
                recursiveFields(layout.attributes, 0)));
            printButton.setDisabled(false);
        };
        this.getTemplateParams(newValue, capabilityCallbackFn);
    },

    /**
     * Fills a template with one entry of the data selection
     * @param {Object} capabilities the capabilities.json
     * @param {*} dataSource one data entry
     */
    fillTemplate: function( capabilities, data) {
        var resultData = {};
        var attribs = capabilities.layouts[0].attributes;
        for (var i=0; i < attribs.length; i ++) {
            if (attribs[i].type === 'string') {
                if (data.get(attribs[i].name)) {
                    resultData[attribs[i].name] = data.get(attribs[i].name);
                } else {
                    // TODO resultData[attribs[i].name] = printDialog.getDefaultForName();
                }
            } else if (attribs[i].type === 'DataSourceAttributeValue') {
                // recursion!
            }
        }
        return resultData;
    },

    /**
     * print the selection as data table
     */
    printTable: function(grid, callbackFn, filename) {
        var sortingFilters = this.fetchSortingAndFilters(); // TODO include in request to print service
        var selection = grid.view.getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        var columnNames = [];
        var displayName = grid.rowtarget.dataType ?
            i18n.getMsg('rowtarget.title.'+ grid.rowtarget.dataType)
            : '';
        var data = [];
        // create array of column definitions from visible columns
        // columns in the array 'ignored' will not be printed
        var ignored = ['owner', 'readonly', 'id', 'probeId'];
        var visibleColumns =[];
        var cols = grid.getVisibleColumns();
        for (var i=0; i <cols.length; i++) {
            if (cols[i].dataIndex && cols[i].text && (ignored.indexOf(cols[i].dataIndex) === -1)) {
                visibleColumns.push({
                    dataIndex: cols[i].dataIndex,
                    renderer: (cols[i].renderer.$name === 'defaultRenderer') ? null: cols[i].renderer
                });
                columnNames.push(cols[i].text);
            }
        }

        // Retrieve Data from selection
        for (var item in selection) {
            var row = selection[item].data;
            var out = [];

            //Lookup every column and write to data array;
            for (i = 0; i < visibleColumns.length; i++) {
                var rawData = row[visibleColumns[i].dataIndex];
                if (visibleColumns[i].renderer) {
                    out.push(visibleColumns[i].renderer(rawData));
                } else {
                    out.push(rawData);
                }
            }
            data.push(out);
        }
        var sortingFilters = this.fetchSortingAndFilters(); // TODO include in request to print service
        var printData = {
            'layout': 'A4 landscape',
            'outputFormat': 'pdf',
            'attributes': {
                'title': i18n.getMsg('print.tableTitle'),
                'displayName': displayName,
                'table': {
                    'columns': columnNames,
                    'data': data
                }
            }
        };
        this.sendRequest(printData, 'lada_print', filename, callbackFn);
    },

    /**
     * initiate the printing by collecting the data and sending a request to
     * the print server
     * @param {*} button the calling 'print' button as part of the print dialog
     */
    doPrint: function(button) {
        button.setDisabled(true);
        var window = button.up('printgrid');
        var grid = window.parentGrid;
        if (!grid) {
            this.handleError();
            return;
        }
        var template = window.down('combobox[name=template]').getValue();
        var filename = window.down('textfield[name=filename]').getValue() || 'lada-export';
        var capabilities = window.currentCapabilities;

        if (filename.lastIndexOf('.pdf') !== filename.length - 4) {
            filename += '.pdf';
        }

        var callbackFn = function(success) {

            var i18n = Lada.getApplication().bundle;
            var result = success? i18n.getMsg('print.success') : i18n.getMsg('print.fail');
            window.down('label[name=results]').setText(result);
            window.down('label[name=results]').setHidden(false);
            button.setDisabled(false);
        };

        if (window.down('radio[id=radio_printtable]').getValue() ||
            template === 'lada-print') {
            // TODO how do we mark "tables" here? hardcoded may be obsolete!
            this.printTable(grid, callbackFn, filename);
        } else if (template === 'lada_erfassungsbogen') {
            // TODO: temporary implementation of old "erfassungsbogen" printing
            this.printSelection(grid, filename, callbackFn);
        } else {
            var selection = grid.getView().getSelectionModel().getSelection();
            var data = [];
            for (var i = 0; i< selection.length; i++) {
                data.push(this.fillTemplate(capabilities ,selection[i]));
            }
            this.fetchSortingAndFilters(); // TODO still a dummy! add to data!
            this.sendRequest(data, template, filename, callbackFn);
        }
    },

    /**
     * Send a prepared request to the print server, saves the answer as
     * @param jsonData the prepared data matching the capabilities description of the server
     * @param templateName name/identifier of the template as part of the url
     * @param fileName a filename (including pdf ending)
     */
    sendRequest: function(jsonData, templateName, filename, callbackFn) {
        var me = this;
        Ext.Ajax.request({
            url: me.printUrlPrefix + templateName + '/buildreport.pdf',
            //configure a proxy in apache conf!
            jsonData: jsonData,
            binary: true,
            success: function(response) {
                var content = response.responseBytes;
                var filetype = response.getResponseHeader('Content-Type');
                var blob = new Blob([content],{type: filetype});
                saveAs(blob, filename);
                if (callbackFn) {
                    callbackFn(true);
                }
            },
            failure: function(response) {
                me.handleError(response);
                if (callbackFn) {
                    callbackFn(false);
                }
            }
        });
    },

    /**
     * returns the last loaded search configuration for the data
     */
    fetchSortingAndFilters: function() {
        return Ext.StoreManager.get('genericresults').lastProxyPayload || null;
    },

    // TODO outdated; from "Erfassungsbogen" ?
    /**
     * Send the selection to a Printservice
     */
    printSelection: function(grid, filename, callbackFn) {
        // The Data is loaded from the server again, so we need
        // to be a little bit asynchronous here...
        var callback = function(response) {
            var data = response.responseText;
            data = this.prepareData(data); // Wraps all messstellen and deskriptoren objects into an array
            var printData = '{"layout": "A4 portrait", "outputFormat": "pdf",'
                    + '"attributes": { "proben": ' + data
                    + '}}';
            this.sendRequest(printData, 'lada_erfassungsbogen', filename, callbackFn);
        };

        this.createSheetData(grid, callback, this);
    },

    //TODO moved from "Erfassunsbogen", might be obsolete
    prepareData: function(data) {
        // Copy data
        var prep = JSON.parse(data);
        data = JSON.parse(data);
        // ensure data and prep are equal, not sure
        // if json.parse changes order of things

        var emptyMessstelle = {
            'id': null,
            'amtskennung': null,
            'beschreibung': null,
            'messStelle': null,
            'mstTyp': null,
            'netzbetreiberId': null
        };

        var emptyDeskriptor = {
            's0': null,
            's1': null,
            's2': null,
            's3': null,
            's4': null,
            's5': null,
            's6': null,
            's7': null,
            's8': null,
            's9': null,
            's10': null,
            's11': null
        };

        for (var i in data) {
            var probe = data[i];
            var deskriptoren = probe.deskriptoren;
            var messstelle = probe.messstelle;
            var labormessstelle = probe.labormessstelle;
            var ortszuordnung = probe.ortszuordnung;
            var zusatzwerte = probe.zusatzwerte;

            if (messstelle !== null) {
                prep[i].messstelle = [];
                prep[i].messstelle[0] = messstelle;
                prep[i]['messstelle.messStelle'] = messstelle.messStelle;
            } else {
                prep[i].messstelle = [];
                prep[i].messstelle[0] = emptyMessstelle;
                prep[i]['messstelle.messStelle'] = '';
            }

            if (labormessstelle !== null) {
                prep[i]['labormessstelle.messStelle'] = labormessstelle.messStelle;
            } else {
                prep[i]['labormessstelle.messStelle'] = '';
            }

            if (deskriptoren !== null) {
                prep[i].deskriptoren = [];
                prep[i].deskriptoren[0] = deskriptoren;
            } else {
                prep[i].deskriptoren = [];
                prep[i].deskriptoren[0] = emptyDeskriptor;
            }

            // Flatten the Ortszuodnung Array
            for (var o in ortszuordnung) {
                var oz = ortszuordnung[o];
                for (var e in oz.ort) {
                    prep[i].ortszuordnung[o]['ort']=null;
                    prep[i].ortszuordnung[o]['ort.'+e]=oz.ort[e];
                }
            }
        }

        return JSON.stringify(prep);
    },

    // TODO moved from "Erfassungsbogen", handles Erfassungsbogen
    // Also check if getting json printing could be refactored with gridexport
    /**
     * Returns a Json-Object which contains the data which has
     * to be printed.
     * The parameter printFunctionCallback will be called once the ajax-request
     * starting the json-export was evaluated
     **/
    createSheetData: function(grid, printFunctionCallback, cbscope) {
        var selection = grid.getView().getSelectionModel().getSelection();
        var ids = [];
        for (var item in selection) {
            ids.push(selection[item].get(grid.rowtarget.dataIndex));
        }
        //basically, thats the same as the downloadFile
        // code does.
        var data = '{ "proben": ['+ids.toString()+'] }';
        var me = this;
        Ext.Ajax.request({
            url: 'lada-server/data/export/json',
            jsonData: data,
            binary: false,
            scope: cbscope,
            success: printFunctionCallback,
            failure: function(response) {
                me.handleError(response);
                return null;
            }
        });
    },

    /**
     * Queries the print server for available templates
     */
    getAvailableTemplates: function(window) {
        var me = this;
        Ext.Ajax.request({
            url: me.printUrlPrefix + 'apps.json',
            success: function(response) {
                var data = [];
                if (response.responseText) {
                    var json = Ext.decode(response.responseText);
                    if (Array.isArray(json)) {
                        for (var i=0; i < json.length; i++) {
                            data.push({name: json[i]});
                        }
                    }
                }
                window.setTemplateData(data);
            },
            failure: function(response) {
                me.handleError(response);
                window.setTemplateData(null);
            }
        });
    },

    /**
     * Handles server error feedback by opening an popup window containing
     * details on the error
     * @param response the raw response as given by the server
     */
    handleError: function(response) {
        var i18n = Lada.getApplication().bundle;
        var errormsg = i18n.getMsg('err.msg.print.noContact');
        if (response.status && response.status === 404) {
            errormsg = i18n.getMsg('err.msg.print.404');
        } else if (response.responseText) {
            try {
                var json = Ext.JSON.decode(response.responseText);
                if (json && json.message) {
                    errormsg = i18n.getMsg(json.message);
                }
            } catch (e) {
                console.log(e);
            }
        }
        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'), errormsg);
    }
});
