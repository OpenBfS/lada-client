/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for print functionalities
 * This offers printing using mapfish print templates.
 * To determine available templates, the mapfish print apps.json is queried.
 * To determine the data needed for a template, capabilities.json of mapfish
 * print is parsed.
 * Attribute fields that require "String" values will be matched against field
 * names from the input data. If a match is found, these values are used.
 * If not found, the user is offered a text field where optional values can
 * be inserted/edited prior to export.
 * If the template requires one or more "TableAttributeValue", then the whole
 * input table will be submitted into this field. This allows for printing out
 * a table representation (currently offered by "lada_print").
 * The field names "filterParams and "sortingParams" are treated as special
 * values, and will be filled with information about sorting or filtering that
 * was done for current grid (if the fields are requested by the template.
 * (see widget/DynamicGrid.js:generateColumnsAndFields)
 * sortingParams: { name: String, sort: 'asc'|'desc' }[]
 * filterParams: { name: String, filterValue: String }[]
 *
 */
Ext.define('Lada.controller.Print', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.widget.DynamicGrid',
        'Lada.view.window.PrintGrid'
    ],

    // may be overwritten by any appContext settings
    printUrlPrefix: 'lada-printer/print/',
    irixServletURL: 'irix-servlet',

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
            },
            'printgrid checkbox[name=irix-fieldset-checkbox]': {
                select: this.toggleIrix
            },
            'printgrid': {
                gridupdate: this.handleGridUpdate
            }
        });
    },

    /**
     * Triggers a 'print' dialog from a grid, where further choices about
     * templates can be made
     * @param {Ext.button.Button} button Button that triggered the event
     */
    openPrintDialog: function(button) {
        var win = Lada.view.window.PrintGrid.getInstance();
        var grid = button.up('dynamicgrid');
        win.setParentGrid(grid);
        if (Lada.appContext) {
            if (Lada.appContext.merge.tools.indexOf('irixPrintBtn') >= 0) {
                this.dokPoolEnabled = true;
            }
            if (Lada.appContext.merge.urls['irix-servlet']) {
                this.irixServletURL = Lada.appContext.merge.urls[
                    'irix-servlet'];
            }
            if (Lada.appContext.merge.urls['print-servlet']) {
                this.printUrlPrefix = Lada.appContext.merge.urls[
                    'print-servlet'];
            }
        }

        if (this.dokPoolEnabled) {
            win.addIrixCheckbox();
            win.addIrixFieldset();
        }
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
        var i18n = Lada.getApplication().bundle;

        if (!win.parentGrid) {
            return;
        }
        var fieldset = win.down('fieldset[name=dynamicfields]');
        fieldset.removeAll();
        var availableColumns = win.parentGrid.getColumns();
        win.setDisabled(true);
        if (
            !win.currentCapabilities.layouts ||
            !win.currentCapabilities.layouts.length
        ) {
            return;
        }
        var capabilitiesForLayout = win.currentCapabilities.layouts[newValue];
        if (!capabilitiesForLayout) {
            return;
        }
        //Check for template fields not represented in the result grid
        var recursiveFields = function(attributes) {
            var listOfItems = [];
            for (var i = 0; i < attributes.length; i++) {
                switch (attributes[i].type) {
                    case 'DataSourceAttributeValue':
                    case 'TableAttributeValue':
                        break;
                    case 'String':
                        var matchingColumn = availableColumns
                            // eslint-disable-next-line no-loop-func
                            .some( function(el) {
                                return el.dataIndex === attributes[i].name;
                            });
                        if (!matchingColumn) {
                            if (attributes[i].name === 'timezone' ||
                                attributes[i].name === 'doc_creator' ||
                                attributes[i].name === 'clientVersion') {
                                // timezone, doc creator and ClientVersion
                                // should be filled automatically, and not be
                                // seen in the client
                                break;
                            }
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
                            if ((i18n.getMsg(attributes[i].name).
                                indexOf('undefined')) !== -1) {
                                listOfItems.push({
                                    xtype: 'textfield',
                                    fieldLabel: attributes[i].name,
                                    name: attributes[i].name,
                                    labelWidth: 105,
                                    margin: '5, 5, 5, 5',
                                    anchor: '100%',
                                    value: value
                                });
                            } else {
                                listOfItems.push({
                                    xtype: 'textarea',
                                    fieldLabel: i18n.getMsg(attributes[i].name),
                                    emptyText: i18n.getMsg('emptyText.' +
                                        attributes[i].name),
                                    name: attributes[i].name,
                                    labelWidth: 105,
                                    margin: '5, 5, 5, 5',
                                    anchor: '100%',
                                    grow: true,
                                    cls: 'textAreaCls',
                                    value: value
                                });
                            }
                        }
                        break;
                    case 'Boolean':
                        listOfItems.push({
                            xtype: 'checkbox',
                            fieldLabel: i18n.getMsg(attributes[i].name),
                            name: attributes[i].name,
                            labelWidth: 130,
                            margin: '5, 5, 5, 5',
                            anchor: '100%',
                            value: value
                        });
                        break;
                    default:
                        break;
                }
            }
            return listOfItems.length > 0 ? listOfItems : null;
        };
        var fields = null;
        try {
            fields = recursiveFields(capabilitiesForLayout.attributes);
        } catch (e) {
            if (e === 'lada_erfassungsbogen') {
                fields = null;
            } else {
                throw new Error('unknown template');
            }
        }

        if (fields) {
            fieldset.add(fields);
            fieldset.setVisible(true);
        } else {
            fieldset.setVisible(false);
        }
        win.setDisabled(false);
    },

    changeTemplate: function( combobox, newValue ) {
        var win = combobox.up('printgrid');
        var layoutBox = win.down('combobox[name=layout]');
        var filetypeBox = win.down('combobox[name=filetype]');
        win.setDisabled(true);
        var capabilityCallbackFn = function(capabilities) {
            win.currentCapabilities = capabilities;
            var layoutData = [];
            var formatData = [];
            if ( !capabilities.layouts || !capabilities.layouts.length ) {
                win.setDisabled(true);
                return;
            }
            for (var i = 0; i < capabilities.layouts.length; i++) {
                layoutData.push({
                    id: i,
                    name: capabilities.layouts[i].name
                });
            }
            for (var f = 0; f < capabilities.formats.length; f++ ) {
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
                win.setDisabled(true);
            }
            layoutBox.setValue(0);
            layoutBox.fireEvent('change', layoutBox, 0);
        };
        if (newValue !== null ) {
            this.getTemplateParams(newValue, capabilityCallbackFn);
        }
    },

    fillTemplate: function(attributes, selection, window) {
        // TODO ensure there is no "table" further down the hierarchy
        var resultData = {};
        var fieldselector = '';
        var field = '';
        for (var i = 0; i < attributes.length; i++) {
            switch (attributes[i].type) {
                case 'String':
                    fieldselector = 'textfield[name='
                        + attributes[i].name
                        + ']';
                    field = window.down('fieldset[name=dynamicfields]')
                        .down(fieldselector);
                    if (field) {
                        resultData[attributes[i].name] = field.getValue() || '';
                    } else {
                        //Auto filled fields
                        if (attributes[i].name === 'timezone') {
                            //timezone
                            resultData[attributes[i].name] = Lada.util.Date
                                .getCurrentTimeZone();
                        } else if (attributes[i].name === 'clientVersion') {
                            resultData[attributes[i].name] = 'Clientversion '
                                + Lada.clientVersion;
                        } else if (attributes[i].name === 'doc_creator') {
                            //username
                            resultData[attributes[i].name] = Lada.username;
                        } else {
                            resultData[attributes[i].name] = '';
                        }
                    }
                    break;
                case 'Boolean':
                    fieldselector = 'checkbox[name='
                        + attributes[i].name
                        + ']';
                    field = window.down('fieldset[name=dynamicfields]')
                        .down(fieldselector);
                    resultData[attributes[i].name] = field.getValue();
                    break;
                case 'TableAttributeValue':
                    resultData[attributes[i].name] = this.printTable(
                        window.parentGrid);
                    break;
                case 'DataSourceAttributeValue':
                    if (attributes[i].name === 'filterParams') {
                        var filters = window.parentGrid.currentParams.filters;
                        var setFilters = [];
                        //Remove blank filters
                        // eslint-disable-next-line no-loop-func
                        Ext.Array.each(filters, function(value) {
                            if (value.filter || value.filter !== '') {
                                setFilters.push(value);
                            }
                        });
                        resultData[attributes[i].name] = setFilters;

                        // { name: String, sort: 'asc'|'desc' }[]
                    } else if (attributes[i].name === 'sortingParams') {
                        resultData[attributes[i].name] =
                            window.parentGrid.currentParams.sorting;
                        // {
                        // name: String,
                        // filterValue: String,
                        // filterRegex: Boolean,
                        // filterIsNull: Boolean,
                        // filterNegate: Boolean
                        // }[]
                    } else {
                        resultData[attributes[i].name] = [];
                        for (var sel = 0; sel < selection.length; sel++ ) {
                            resultData[attributes[i].name].push(
                                this.fillTemplateItem(
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
        for (var i = 0; i < attributes.length; i ++) {
            switch (attributes[i].type) {
                case 'String':
                    if (modelEntry.get(attributes[i].name)) {
                        resultData[attributes[i].name] = modelEntry.get(
                            attributes[i].name);
                    } else {
                        var fieldselector = 'textfield[name='
                            + attributes[i].name
                            + ']';
                        if (fieldselector) {
                            var field = window
                                .down('fieldset[name=dynamicfields]')
                                .down(fieldselector);
                            if (field) {
                                // eslint-disable-next-line max-len
                                resultData[attributes[i].name] = field.getValue() || '';
                            }
                        }
                    }
                    break;
                case 'DataSourceAttributeValue':
                    resultData[attributes[i].name] = [];
                    var subitems = modelEntry.items;
                    // considering the items of the model to be one or more
                    // models. currently, there is no known case for it
                    if (subitems && subitems.length) {
                        for (var j = 0;j < subitems.length; j++) {
                            resultData[attributes[i].name].push(
                                this.fillTemplate(
                                    attributes[i].clientParams,
                                    subitems[i],
                                    window)
                            );
                        }
                    } else {
                        // the nested object may be an array of length 1 with
                        // the data already present in the 'main' model
                        // (e.g. one query containing a probe and a messung)
                        resultData[attributes[i].name].push(
                            this.fillTemplate(
                                attributes[i].clientParams,
                                modelEntry,
                                window)
                        );
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
        var selection = grid.getView().getSelectionModel().getSelection();
        var columnNames = [];
        var data = [];
        // create array of column definitions from visible columns
        // columns in the array 'ignored' will not be printed
        var ignored = ['owner', 'readonly', 'id', 'probeId'];
        var visibleColumns = [];
        var cols = grid.getVisibleColumns();
        for (var i = 0; i < cols.length; i++) {
            if (
                cols[i].dataIndex &&
                cols[i].text &&
                (ignored.indexOf(cols[i].dataIndex) === -1)
            ) {
                if (cols[i].dataType === undefined) {
                    visibleColumns.push({
                        dataIndex: cols[i].dataIndex,
                        dataType: 'text',
                        renderer: (cols[i].renderer.$name === 'defaultRenderer') ?
                            null :
                            cols[i].renderer
                    });
                } else {
                    visibleColumns.push({
                        dataIndex: cols[i].dataIndex,
                        dataType: cols[i].dataType.name,
                        renderer: (cols[i].renderer.$name === 'defaultRenderer') ?
                            null :
                            cols[i].renderer
                    });
                }
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
                if (visibleColumns[i].renderer && visibleColumns[i].dataType !== 'textLineBr') {
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
        var window = button.up('printgrid');
        var i18n = Lada.getApplication().bundle;
        var isIrix = false;
        var irixCheckbox = window.down('checkbox[name=irix-fieldset-checkbox]');
        if (window.down('label[name=results]')) {
            window.down('label[name=results]').setHidden(true);
        }
        if (irixCheckbox && irixCheckbox.getValue() === true) {
            isIrix = true;
        }
        var grid = window.parentGrid;
        if (!grid) {
            this.handleError();
            return;
        }
        var template = window.down('combobox[name=template]').getValue();
        var layout = window.down('combobox[name=layout]').getValue();
        var filename = window.down('textfield[name=filename]')
            .getValue() || 'lada-export';
        var format = window.down('combobox[name=filetype]').getValue();
        var capabilities = window.currentCapabilities;
        if (template === null) {
            Ext.Msg.alert('', i18n.getMsg('err.msg.print.noTemplateSelected'));
            return;
        }
        filename = this.validateFilename(filename, format);
        if (!filename) {
            window.down('textfield[name=filename]').reset();
            return;
        }
        window.setDisabled(true);
        window.setLoading(true);
        var callbackFn = function(success) {
            var result = success ?
                i18n.getMsg('print.success') :
                i18n.getMsg('print.fail');
            window.down('label[name=results]').setText(result);
            window.down('label[name=results]').setHidden(false);
            window.setDisabled(false);
            window.setLoading(false);
        };
        //Check if layout attributes are proben and messungen
        var attributes = capabilities.layouts[layout].attributes;
        var probenAttribute = null;
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            if (attribute.name === 'samples') {
                probenAttribute = attribute;
            }
        }
        var qitem = this.addQueueItem(filename, 'lada-print');
        if (probenAttribute) {
            //TODO: preset fields are ignored here as they are no longer needed
            // see printSelection, prepareData, createSheetData
            // (moved without major adaption)
            this.printSelection(
                grid, filename, format, callbackFn, isIrix, qitem,
                capabilities.app, capabilities.layouts[layout].name
            );
        } else {
            var selection;
            try {
                selection = grid.getView().getSelectionModel().getSelection();
            } catch (e) {
                this.handleError();
                return;
            }
            var data = this.fillTemplate(
                capabilities.layouts[layout].attributes,
                selection,
                window);
            var printData = {
                layout: capabilities.layouts[layout].name,
                outputFormat: format,
                attributes: data
            };
            this.sendRequest(
                printData, template, filename, callbackFn, isIrix, qitem
            );
        }
    },


    /**
     * Send a prepared request to the print server, saves the answer as
     * @param jsonData the prepared data matching the capabilities description
     * of the server
     * @param templateName name/identifier of the template as part of the url
     * @param fileName a filename (including filetype typical ending)
     * @param callbackFn a function used in callback
     * @param isIrix Irix requests are handled differently, as the response
     * is a pdf
     * @param queueItem a downloadqueue store item to be used for information
     * on the download status
     */

    sendRequest: function(
        jsonData,
        templateName,
        filename,
        callbackFn,
        isIrix,
        queueItem
    ) {
        var me = this;
        var requestData = {
            success: function(response) {
                if (!isIrix) {
                    var json = Ext.decode(response.responseText);
                    queueItem.set('refId', json.ref);
                    queueItem.set('mapfish_statusURL', json.statusURL);
                    queueItem.set('mapfish_downloadURL', json.downloadURL);
                    queueItem.set('status', 'waiting');
                    if (json.error) {
                        queueItem.set('message', json.error );
                    } else {
                        queueItem.set('message', '' );
                    }
                } else {
                    if (response.responseText) {
                        window.open(
                            'data:application/xml,' +
                            encodeURIComponent(response.responseText)
                        );
                    }
                }
                if (callbackFn) {
                    callbackFn(true);
                }
            },
            failure: function(response) {
                if (queueItem) {
                    queueItem.set('status', 'error');
                    queueItem.set('message', 'server error'); // TODO clarify
                }
                me.handleError(response);
                if (callbackFn) {
                    callbackFn(false);
                }
            }
        };
        if (isIrix) {
            requestData.jsonData = JSON.stringify(
                this.setUpIrixJson(jsonData, templateName)
            );
            requestData.headers = {
                'Content-Type': 'application/json'
            };
            requestData.url = this.irixServletURL;
        } else {
            requestData.url = me.printUrlPrefix + templateName + '/report.pdf';
            requestData.timeout = 60000;
            requestData.jsonData = JSON.stringify(jsonData);
        }
        Ext.Ajax.request(requestData);
    },

    /**
     * (Legacy) Send the selection to a Printservice. Special handling for an
     * lada_erfassungsbogen. First it needs to query the lada-server, then
     * this response is aggregated (see pepareData)
     * TODO: lacks handling for server errors/timeouts
     */
    printSelection: function(
        grid,
        filename,
        format,
        callbackFn,
        isIrix,
        queueitem,
        templateName,
        layout
    ) {
        // The Data is loaded from the server again, so we need
        // to be a little bit asynchronous here...
        var callback = function(response) {
            var data = response.responseText;
            // Wraps all messstellen and deskriptoren objects into an array
            data = this.prepareData(data);
            var printData = {
                layout: layout,
                outputFormat: format,
                attributes: {
                    samples: data,
                    // TODO: hard coded submission of time zone data.
                    // Not elegant, but required because of separate
                    // Erfassungsbogen handling
                    timezone: Lada.util.Date.getCurrentTimeZone()
                }};

            this.sendRequest(
                printData,
                templateName,
                filename,
                callbackFn,
                isIrix,
                queueitem);
        };

        this.createSheetData(grid, callback, this, queueitem);
    },

    /**
     * (legacy function) Aggregates json responses from lada server in order
     * to satisfy lada_erfassungsbogen template demands
     */
    prepareData: function(data) {
        // Copy data
        var prep = Ext.JSON.decode(data, true);
        if (prep === null) {
            this.handleError(null, 'err.msg.print.failed');
            return null;
        }
        data = Ext.JSON.decode(data, true);
        // ensure data and prep are equal, not sure
        // if parsing changes order of things

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
            var deskriptoren = probe.envDescrip;
            var messstelle = probe.measFacil;
            var labormessstelle = probe.apprLab;
            var ortszuordnung = probe.geolocat;

            if (messstelle !== null) {
                prep[i].measFacil = [];
                prep[i].measFacil[0] = messstelle;
                prep[i]['measFacil.name'] = messstelle.name;
            } else {
                prep[i].measFacil = [];
                prep[i].measFacil[0] = emptyMessstelle;
                prep[i]['measFacil.name'] = '';
            }

            if (labormessstelle !== null) {
                prep[i]['apprLab.name'] =
                    labormessstelle.name;
            } else {
                prep[i]['apprLab.name'] = '';
            }
            if ((deskriptoren)) {
                prep[i].envDescrip = [];
                prep[i].envDescrip[0] = deskriptoren;
            } else {
                prep[i].envDescrip = [];
                prep[i].envDescrip[0] = emptyDeskriptor;
            }

            // Flatten the Ortszuodnung Array
            for (var o in ortszuordnung) {
                var oz = ortszuordnung[o];
                for (var e in oz.site) {
                    prep[i].geolocat[o]['site'] = null;
                    prep[i].geolocat[o]['site.' + e] = oz.site[e];
                }
                if (oz.typeRegulation === 'E') {
                    prep[i].adminUnit = oz.site.adminUnit;
                }
            }
        }
        return prep;
    },

    // TODO moved from "Erfassungsbogen"
    // Also check if getting json printing could be refactored with gridexport
    /**
     * Returns a Json-Object which contains the data which has
     * to be printed.
     * The parameter printFunctionCallback will be called once the ajax-request
     * starting the json-export was evaluated
     **/
    createSheetData: function(grid, printFunctionCallback, cbscope, qitem) {
        var selection = grid.getView().getSelectionModel().getSelection();
        var ids = [];
        for (var item in selection) {
            if (selection[item].get(grid.rowtarget.probeIdentifier)) {
                var Id = selection[item].get(grid.rowtarget.probeIdentifier);
            } else {
                var Id = selection[item].get(grid.rowtarget.messungIdentifier)
            }

            // avoids printing more than one sheet per probe
            if (ids.indexOf(Id < 0)) {
                ids.push(Id);
            }
        }
        //basically, thats the same as the downloadFile
        // code does.
        if (selection[item].get(grid.rowtarget.probeIdentifier)) {
             var data = '{ "proben": [' + ids.toString() + '] }';
        } else {
            var data = '{ "messungen": [' + ids.toString() + '] }';
        }
        var me = this;
        Ext.Ajax.request({
            url: 'lada-server/data/export/json',
            jsonData: data,
            binary: false,
            scope: cbscope,
            success: printFunctionCallback,
            failure: function(response) {
                var i18n = Lada.getApplication().bundle;
                me.handleError(response, 'err.msg.print.failed');
                qitem.set('status', 'error');
                qitem.set('message', i18n.getMsg('err.msg.print.failed'));
                qitem.set('done', true);
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
                    var grid = window.parentGrid;
                    if (Array.isArray(json)) {
                        for (var i = 0; i < json.length; i++) {
                            if (json[i] !== 'lada_erfassungsbogen') {
                                data.push({name: json[i]});
                            } else if (grid.rowtarget.probeIdentifier
                                || grid.rowtarget.messungIdentifier) {
                            // special handling for "lada_erfassungsbogen":
                            // only usable if we have some non-null probe
                            // identifier
                                var selection = grid.getSelectionModel()
                                    .getSelection()[0];
                                if (
                                    selection &&
                                    selection.data[
                                        grid.rowtarget.probeIdentifier] !==
                                            undefined ||
                                     selection.data[
                                        grid.rowtarget.messungIdentifier] !==
                                            undefined
                                ) {
                                    data.push({name: json[i]});
                                }
                            }
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
     * @param message Key of i18n message to be displayed
     */
    handleError: function(response, message) {
        var i18n = Lada.getApplication().bundle;
        var errormsg = i18n.getMsg('err.msg.print.noContact');
        if (message !== undefined) {
            errormsg = i18n.getMsg(message);
        } else if (response && response.status && response.status === 404) {
            errormsg = i18n.getMsg('err.msg.print.404');
        } else if (response && response.responseText) {
            var json = Ext.JSON.decode(response.responseText, true);
            if (json && json.message) {
                errormsg = i18n.getMsg(json.message);
            }
        }
        Lada.view.window.PrintGrid.getInstance().setDisabled(false);
        Lada.view.window.PrintGrid.getInstance().setLoading(false);
        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'), errormsg);
    },

    /**
     * TODO taken from gridexport controller. refactoring potential here
     * @param name the filename
     * @param format and file 'type' typical ending
     * @returns the filename with the proper extension if valid, or null
     * (and invokes "handleError" with a custom message indicating wrong
     * filename)
     */
    validateFilename: function(name, format) {
        //TODO better regex: this is quite basic
        var pattern = new RegExp(/^(\w|[äöüß])+(\w|\.|\s|[äüöß-]|)*[^\W\.]$/i);
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
    },

    // taken from
    // openBFS/gis-client/src/view/form/Print.js by terrestris GmbH & Co. KG
    setUpIrixJson: function(mapfishPrint, printapp) {

        var printgrid = Ext.ComponentQuery.query('printgrid')[0];
        var me = this;
        var irixJson = {};
        irixJson.irix = me.formItemToJson(
            printgrid.down('k-form-irixfieldset'));
        // the generic serialisation needs a little bit shuffeling
        irixJson = me.adjustIrixSerialisation(irixJson);
        // always add the printapp to the top-lvel for irix:
        irixJson.printapp = printapp;
        irixJson['mapfish-print'] = mapfishPrint;
        return irixJson;
    },

    // taken from
    // openBFS/gis-client/src/view/form/Print.js by terrestris GmbH & Co. KG
    /**
     * Certain fields must live inside the irix fieldset, as they only make
     * sense for this type of "print"; yet their serialisation cannot live in
     * dedicted irix-object, as it is e.g. expected on the top-level. Thus
     * the "irixContext.json" represents the allocation how it shall look like
     * inside the print window. This method will adjust a JSON (e.g. from
     * formItemToJson), and shuffle certain key / value pairs around: currently
     * only 'request-type'.
     *
     * @param {object} irixJson The JSON for the IRIX service, a representation
     *     of the form.
     * @return {object} The adjusted serialisation.
     */
    adjustIrixSerialisation: function(irixJson) {
        var irix = irixJson.irix;
        // move requestType or request-type out of irix object to top-level
        var correctRequestTypeKey = 'request-type';
        // For backwards compatibility, we iterate over two variants
        var keysReqestType = ['requestType', correctRequestTypeKey];
        if (irix) {
            var reqType;
            Ext.each(keysReqestType, function(keyRequestType) {
                if (keyRequestType in irix) {
                    // if both were present, the dashed version will win.
                    reqType = irix[keyRequestType];
                    // delete the one under key 'irix'
                    delete irixJson.irix[keyRequestType];
                    // set on top-level.
                    irixJson[correctRequestTypeKey] = reqType;
                }
            });

            //move "DokpoolContentType", "IsElan", "IsDoksys", "IsRodos",
            // "IsRei" back to "DokpoolMeta"
            //and "ReportContext", "Confidentiality"
            //back to "Identification"
            //and "ElanScenarios"
            //back to "DokpoolMeta"
            irixJson.irix.Identification.ReportContext = irixJson.irix.
                ReportContext;
            delete irixJson.irix.ReportContext;

            irixJson.irix.Identification.Confidentiality = irixJson.irix.
                Confidentiality;
            delete irixJson.irix.Confidentiality;

            irixJson.irix.DokpoolMeta.DokpoolContentType = irixJson.irix.
                DokpoolContentType;
            delete irixJson.irix.DokpoolContentType;

            irixJson.irix.DokpoolMeta.IsElan = irixJson.irix.DokpoolBehaviour.
                IsElan;
            irixJson.irix.DokpoolMeta.IsDoksys = irixJson.irix.DokpoolBehaviour.
                IsDoksys;
            irixJson.irix.DokpoolMeta.IsRodos = irixJson.irix.DokpoolBehaviour.
                IsRodos;
            irixJson.irix.DokpoolMeta.IsRei = irixJson.irix.DokpoolBehaviour.
                IsRei;
            delete irixJson.irix.DokpoolBehaviour;

            irixJson.irix.DokpoolMeta.Elan = {};
            irixJson.irix.DokpoolMeta.Elan.Scenarios = irixJson.irix.Scenarios;
            delete irixJson.irix.Scenarios;
        }
        if (this.config.chartPrint) {
            irixJson['mapfish-print'] = undefined;
            delete irixJson['mapfish-print'];
            irixJson['img-print'] = [{
                mimetype: 'image/png',
                inputFormat: 'png',
                metadata: [],
                outputFormat: 'png',
                value: this.config.chart
            }];
        }
        return irixJson;
    },

    formItemToJson: function(formItem) {
        var me = this;
        var children = formItem.items.items;
        var json = {};

        Ext.each(children, function(child) {
            if (child instanceof Ext.form.FieldSet ||
                child instanceof Ext.form.FieldContainer) {

                if (child.valueField && child.valueField.getValue()) {
                    json[child.name] = child.valueField.getValue();
                } else {
                    json[child.name] = me.formItemToJson(child);
                }

            } else if (child instanceof Ext.Container) {
                json[child.name] = child.down('textfield').getValue();
            } else {
                json[child.name] = child.getValue();
            }
        });

        return json;
    },

    toggleIrix: function(checkbox, newValue) {
        var fieldset = checkbox.up('printgrid').down('k-form-irixfieldset');
        if (fieldset) {
            fieldset.setVisible(newValue);
        }
    },

    /**
     * Handle an update of the current result window and update the print window
     * accordingly.
     * @param {Lada.view.window.PrintGrid} win The window to update
     */
    handleGridUpdate: function(win) {
        var layoutBox = win.down('combobox[name=layout]');
        if (!layoutBox) {
            return;
        }
        var layout = layoutBox.getValue();
        this.changeLayout(layoutBox, layout);
    },

    /**
     * Add an entry to the downloadqueue.
     * @param filename: The name used to save results
     * @param type: queue type (defining the interface for communication)
     *          available: 'lada-print', 'export'
     * @returns reference to the model item
     */
    addQueueItem: function(filename, type) {
        var storeItem = Ext.create('Lada.model.DownloadQueue', {
            type: type,
            filename: filename,
            startDate: new Date().valueOf(),
            status: 'preparation',
            done: false,
            autodownload: false
        });
        var store;
        if (type === 'lada-print') {
            store = Ext.data.StoreManager.get('downloadqueue-print');
        } else {
            store = Ext.data.StoreManager.get('downloadqueue-export');
        }
        store.add(storeItem);
        return storeItem;
    }
});
