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
                change: this.changeTemplate
            },
            'printgrid combobox[name=layout]': {
                change: this.changeLayout
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
                me.handleError(response);
            }
        });
    },

    changeLayout: function(combobox, newValue) {
        var win = combobox.up('printgrid');
        var printButton = win.down('button[action=doPrint]');
        var fieldset = win.down('fieldset[name=dynamicfields]');
        fieldset.removeAll();
        var availableColumns = win.parentGrid.getColumns();
        printButton.setDisabled(true);
        if (! win.currentCapabilities.layouts || !win.currentCapabilities.layouts.length) {
            return;
        }
        var capabilitiesForLayout = win.currentCapabilities.layouts[newValue];
        if (!capabilitiesForLayout) {
            return;
        }
        var recursiveFields = function(attributes) {
            var listOfItems = [];
            for (var i = 0; i < attributes.length; i++) {
                switch (attributes[i].type){
                    case 'DataSourceAttributeValue':
                        var subfields = recursiveFields(attributes[i].clientParams.attributes);
                        if (subfields) {
                            listOfItems = listOfItems.concat(subfields);
                        }
                        break;
                    case 'TableAttributeValue':
                        break;
                    case 'String':
                        var matchingColumn = availableColumns.some( function(el) {
                            el.dataIndex === attributes[i].name
                        });
                        if (!matchingColumn) {

                            /* hardcoded workaround to not lose the previously
                            automatic displayName presets for lada_print*/
                            var value = attributes[i].default;
                            if (win.currentCapabilities.app === 'lada_print'
                            && attributes[i].name === 'displayName'
                            && win.parentGrid.rowtarget) {
                                value = Lada.getApplication().bundle.getMsg(
                                    'rowtarget.title.'
                                    + win.parentGrid.rowtarget.dataType);
                            }

                            listOfItems.push({
                                xtype: 'textfield',
                                fieldLabel: attributes[i].name,
                                margin: '5, 5 ,5 ,5',
                                value: value
                            });
                        }
                        break;
                    default:
                        break;
                }
            }
            return listOfItems.length > 0 ? listOfItems : null;
        };
        var fields = recursiveFields(capabilitiesForLayout.attributes);
        if (fields) {
            fieldset.add(fields);
            fieldset.setVisible(true);
        } else {
            fieldset.setVisible(false);
        }
        printButton.setDisabled(false);
    },

    changeTemplate: function( combobox, newValue ) {
        var win = combobox.up('printgrid');
        var printButton = win.down('button[action=doPrint]');
        var layoutBox = win.down('combobox[name=layout]');
        var filetypeBox = win.down('combobox[name=filetype]');
        printButton.setDisabled(true);
        var capabilityCallbackFn = function(capabilities) {
            win.currentCapabilities = capabilities;
            var layoutData = [];
            var formatData = [];
            if ( !capabilities.layouts || !capabilities.layouts.length ) {
                layoutBox.setDisabled(true);
                printButton.setDisabled(true);
                return;
            }
            for (var i=0; i < capabilities.layouts.length; i++) {
                layoutData.push({
                    id: i,
                    name: capabilities.layouts[i].name
                });
            }
            for (var f=0; f < capabilities.formats.length; f++ ) {
                formatData.push({name: capabilities.formats[f]});
            }
            win.formatStore.removeAll();
            win.formatStore.add(formatData);
            if (formatData.length > 1) {
                filetypeBox.setDisabled(false);
                if (('pdf').indexOf(capabilities.formats) >= 0) {
                    filetypeBox.select('pdf');
                }
            } else {
                filetypeBox.setDisabled(true);
            }
            win.layoutStore.removeAll();
            win.layoutStore.add(layoutData);
            if (layoutData.length > 0) {
                layoutBox.setDisabled(false);
            } else {
                layoutBox.setDisabled(true);
                printButton.setDisabled(true);
            }
            layoutBox.setValue(0);
            layoutBox.fireEvent('change', layoutBox, 0);
        };
        this.getTemplateParams(newValue, capabilityCallbackFn);
    },

    fillTemplate: function(attributes, selection, window) {
        // TODO ensure there is no "table" further down the hierarchy
        var resultData = {};
        for (var i=0; i < attributes.length; i++) {
            switch (attributes[i].type) {
                case 'String':
                    var fieldselector = 'textfield[name=' + attributes[i].name + ']';
                    var field = window.down('fieldset[name=dynamicfields]').down(fieldselector);
                    if (field) {
                        resultData[attributes[i].name] = field.getValue() || '';
                    } else {
                        resultData[attributes[i].name] = '';
                    }
                    break;
                case 'TableAttributeValue':
                    resultData[attributes[i].name] = this.printTable(window.parentGrid);
                    break;
                case 'DataSourceAttributeValue':
                    // the attributes filterParams and sortParams are assumed
                    // to be a query for the sorting and filter settings; they
                    // will be submitted as at the time of grid generation,
                    // see widget/DynamicGrid.js:generateColumnsAndFields
                    if (attributes[i].name === 'filterParams') {
                        resultData[attributes[i].name] =
                            window.parentGrid.currentParams.filters;
                        // { name: String, sort: 'asc'|'desc' }[]
                    } else if (attributes[i].name === 'sortingParams') {
                        resultData[attributes[i].name] =
                            window.parentGrid.currentParams.sorting;
                        // { name: String, filterValue: String }[]
                    } else {
                        resultData[attributes[i].name] = [];
                        for (var sel = 0; sel < selection.length; sel++ ) {
                            resultData.push(this.fillTemplateItem(
                                attributes[i].clientParams.attributes,
                                selection[sel],
                                window)
                            );
                        }
                    }
                    break;
            }
        }
        return resultData;
    },

    fillTemplateItem: function( attributes, modelEntry, window) {
        var resultData = {};
        for (var i=0; i < attributes.length; i ++) {
            switch (attributes[i].type) {
                case 'String':
                    if (modelEntry.get(attributes[i].name)) {
                        resultData[attributes[i].name] = modelEntry.get(attributes[i].name);
                    } else {
                        var fieldselector = 'textfield[name=' + attributes[i].name + ']';
                        var field = window.down('fieldset[name=dynamicfields]').down(fieldselector);
                        if (field) {
                            resultData[attributes[i].name] = field.getValue() || '';
                        }
                    }
                    break;
                case 'DataSourceAttributeValue':
                    resultData[attributes[i].name] = [];
                    var subitems = modelEntry.items;
                    if (subitems && subitems.length) {
                        for (var j=0;j< subitems.length; j++) {
                            resultData[attributes[i].name].push(
                                this.fillTemplate(attributes[i].clientParams, subitems[i], window)
                            );
                        }
                    }
                    break;
            }
        }
        return resultData;
    },

    /**
     * return a the selection as data table
     */
    printTable: function(grid) {
        var selection = grid.view.getSelectionModel().getSelection();
        var columnNames = [];
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
        return {
            columns: columnNames,
            data: data
        };
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
        var layout = window.down('combobox[name=layout]').getValue();
        var filename = window.down('textfield[name=filename]').getValue() || 'lada-export';
        var format = window.down('combobox[name=filetype]').getValue();
        var capabilities = window.currentCapabilities;
        filename = this.validateFilename(filename);
        if (!filename) {
            window.down('textfield[name=filename]').reset();
            return;
        }
        var callbackFn = function(success) {
            var i18n = Lada.getApplication().bundle;
            var result = success? i18n.getMsg('print.success') : i18n.getMsg('print.fail');
            window.down('label[name=results]').setText(result);
            window.down('label[name=results]').setHidden(false);
            button.setDisabled(false);
        };
        if (template === 'lada_erfassungsbogen') {
            // TODO: this is the old implementation of "erfassungsbogen" printing
            // see printSelection, prepareData, createSheetData (moved without major adaption)
            this.printSelection(grid, filename, format, callbackFn);
        } else {
            var selection = grid.getView().getSelectionModel().getSelection();
            var data = this.fillTemplate(
                capabilities.layouts[layout].attributes,
                selection,
                window);
            var printData = {
                layout: capabilities.layouts[layout].name,
                outputFormat: format,
                attributes: data
            };
            this.sendRequest(JSON.stringify(printData), template, filename, callbackFn);
        }
    },


    /**
     * Send a prepared request to the print server, saves the answer as
     * @param jsonData the prepared data matching the capabilities description of the server
     * @param templateName name/identifier of the template as part of the url
     * @param fileName a filename (including filetype typical ending)
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

    // TODO partly outdated; from "Erfassungsbogen"
    /**
     * Send the selection to a Printservice
     */
    printSelection: function(grid, filename, format, callbackFn) {
        // The Data is loaded from the server again, so we need
        // to be a little bit asynchronous here...
        var callback = function(response) {
            var data = response.responseText;
            data = this.prepareData(data); // Wraps all messstellen and deskriptoren objects into an array
            var printData = {
                layout: 'A4 portrait',
                outputFormat: format,
                attributes: { proben: data }};
            this.sendRequest(
                JSON.stringify(printData),
                'lada_erfassungsbogen',
                filename,
                callbackFn);
        };

        this.createSheetData(grid, callback, this);
    },

    //TODO moved from "Erfassunsbogen"
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
                    // TODO filter by availableTemplates for this query
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
    handleError: function(response, message) {
        var i18n = Lada.getApplication().bundle;
        var errormsg = i18n.getMsg('err.msg.print.noContact');
        if (message !== undefined) {
            errormsg = i18n.getMsg(message);
        } else if (response.status && response.status === 404) {
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
    },

    /**
     * taken from gridexport controller. refactoring potential here
     * @param name the filename
     * @param format and file 'type' typical ending
     * @returns the filename with the proper extension if valid, or null
     * (and invokes "handleError" with a custom message indicating wrong filename)
     */
    validateFilename: function(name, format) {
        //TODO better regex: this is quite basic
        var pattern = new RegExp(/^(\w|[äöüß])+(\w|\.|\s|[äüöß])*[^\W\.]$/i);
        if (!pattern.test(name)) {
            this.handleError(null, 'export.invalidfilename');
            return null;
        } else {
            if (name.length > format.length + 1 && name.toLowerCase().indexOf(
                format.toLowerCase()) === name.length - format.length) {
                return name;
            } else {
                return name + '.' + format;
            }
        }
    }
});
