/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to select data export and settings
 */
Ext.define('Lada.view.window.GridExport', {
    extend: 'Ext.window.Window',
    alias: 'widget.exportdata',
    requires: [
        'Lada.controller.Print',
        'Lada.view.grid.DownloadQueue'
    ],

    controller: 'print',

    defaults: {
        margin: '5, 5, 5, 5',
        border: false
    },

    width: 600,
    collapsible: true,
    maximizable: true,
    autoShow: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    grid: null,

    /** the column defining the geometry data for geojson export */
    hasGeojson: null,

    /** the column defining the probeId for LAF export, or true if grid
     * * consists of Proben without having a probeId result_type column */
    hasProbe: null,

    /** the column defining the messungId for LAF export, or true if grid
    * consists of Messungen without having a messungId result_type column */
    hasMessung: null,

    /**
     * the rowexpander object; will be set on initialize and expanded once at
     * the first entry (to get column definitions).
     */
    rowexp: null,
    /**
     * the (optional) list of gridrowExpander columns to be exported. Will be
     * filled by the ui user
     */
    expcolumns: [],


    /**
     * internal storage for fetched secondaty data
     */
    secondaryData: [],

    lafRequestUrl: 'lada-server/data/asyncexport/laf',
    csvRequestURL: 'lada-server/data/asyncexport/csv',
    jsonRequestURL: 'lada-server/data/asyncexport/json',

    /**
     *Initialize the Window and the options available
     */
    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('export.title');

        this.buttons = [{
            action: 'export',
            text: i18n.getMsg('export.button')
        }, {
            action: 'copyGeoJson',
            icon: 'resources/img/map_add.png',
            iconAlign: 'left',
            text: i18n.getMsg('export.button.copy'),
            hidden: true
        }, '->', {
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];

        var columns = this.grid.getColumns();

        // add CSV export options
        this.csv_linesepstore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: i18n.getMsg('lineseparator.windows'),
                value: 'windows'
            }, {
                name: i18n.getMsg('lineseparator.linux'),
                value: 'linux'
            }]
        });
        this.csv_textlimstore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: i18n.getMsg('doublequotes'),
                value: 'doublequote'
            }, {
                name: i18n.getMsg('singlequotes'),
                value: 'singlequote'
            }]
        });

        this.csv_colsepstore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: i18n.getMsg('semicolon'),
                value: 'semicolon'
            }, {
                name: i18n.getMsg('comma'),
                value: 'comma'
            }, {
                name: i18n.getMsg('whitespace'),
                value: 'space'
            }, {
                name: i18n.getMsg('dot'),
                value: 'period'
            }]
        });

        this.csv_decSepStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: i18n.getMsg('comma'),
                value: 'comma'
            }, {
                name: i18n.getMsg('dot'),
                value: 'period'
            }]
        });

        var columnslist = [];
        var preselected = [];
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].dataIndex &&
                columns[i].dataIndex !== 'readonly' &&
                columns[i].text.length) {
                columnslist.push({
                    value: columns[i].dataIndex,
                    name: columns[i].text
                });
                preselected.push(columns[i].dataIndex);
                if (!columns[i].dataType) {
                    continue;
                }
                switch (columns[i].dataType.name) {
                    case 'geom':
                        this.hasGeojson = columns[i];
                        break;
                    case 'messungId':
                        this.hasMessung = columns[i].dataIndex;
                        break;
                    case 'probeId':
                        this.hasProbe = columns[i].dataIndex;
                        break;
                }
            }
        }
        this.columnListStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: columnslist
        });

        //store for additional rowExpander columns
        this.expcolumnList = Ext.create('Ext.data.Store', {
            fields: ['name', 'value']
        });

        // add export formats
        var formatdata = [
            {name: i18n.getMsg('export.csv'), value: 'csv'},
            {name: i18n.getMsg('export.json'), value: 'json'}];
        if (this.hasGeojson) {
            formatdata.push({
                name: i18n.getMsg('export.gjson'),
                value: 'geojson'
            });
        }
        if (this.hasProbe || this.hasMessung) {
            formatdata.push({
                name: i18n.getMsg('export.laf'),
                value: 'laf'
            });
        }
        this.formatStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: formatdata
        });

        // create comboboxes and checkboxes
        this.items = [{
            xtype: 'container',
            name: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                displayField: 'name',
                valueField: 'value',
                labelWidth: 200,
                width: 400
            },
            items: [{
                xtype: 'combobox',
                fieldLabel: i18n.getMsg('export.format'),
                name: 'formatselection',
                store: me.formatStore,
                value: 'csv',
                listeners: {
                    change: me.changeFormat
                }
            }, {
                xtype: 'checkbox',
                name: 'allcolumns',
                fieldLabel: i18n.getMsg('export.allcolumns'),
                checked: true,
                listeners: {
                    change: me.exportallcolumntoggle
                }
            }, {
                xtype: 'checkbox',
                name: 'secondarycolumns',
                fieldLabel: i18n.getMsg('export.secondarycolumns'),
                checked: this.grid.exportRowexp ? true : false,
                listeners: {
                    change: me.exportsecondarytoggle
                },
                hidden: true
            }, {
                xtype: 'checkbox',
                name: 'allrows',
                fieldLabel: i18n.getMsg('export.allrows')
            }, {
                xtype: 'tagfield',
                name: 'exportcolumns',
                labelWidth: 100,
                fieldLabel: i18n.getMsg('export.columns'),
                store: me.columnListStore,
                hidden: true,
                value: preselected,
                multiSelect: true,
                listeners: {
                    change: function() {
                        me.resetCopyButton(me);
                    }
                }
            }, {
                xtype: 'tagfield',
                name: 'exportexpcolumns',
                labelWidth: 100,
                fieldLabel: i18n.getMsg('export.expcolumns'),
                store: me.expcolumnList,
                hidden: true,
                value: null,
                multiSelect: true,
                listeners: {
                    change: function() {
                        me.resetCopyButton(me);
                    }
                }
            }, {
                xtype: 'combobox',
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
                    }]
                }),
                value: 'iso-8859-15'
            }, {
                xtype: 'fieldset',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                title: i18n.getMsg('export.csvdetails'),
                collapsible: true,
                collapsed: true,
                name: 'csvoptions',
                visible: false,
                margins: '5,5,5,5',
                align: 'end',
                defaults: {
                    displayField: 'name',
                    valueField: 'value',
                    labelWidth: 120
                },
                items: [{
                    xtype: 'combobox',
                    name: 'linesep',
                    store: me.csv_linesepstore,
                    fieldLabel: i18n.getMsg('export.linesep'),
                    value: 'windows'
                }, {
                    xtype: 'combobox',
                    name: 'textlim',
                    fieldLabel: i18n.getMsg('export.textsep'),
                    store: me.csv_textlimstore,
                    value: 'doublequote'
                }, {
                    xtype: 'combobox',
                    name: 'colsep',
                    fieldLabel: i18n.getMsg('export.columnlim'),
                    store: me.csv_colsepstore,
                    value: 'semicolon'
                }, {
                    xtype: 'combobox',
                    name: 'decsep',
                    store: me.csv_decSepStore,
                    fieldLabel: i18n.getMsg('decimalseparator'),
                    value: 'comma'
                }]
            }, {
                xtype: 'textfield',
                name: 'filename',
                margin: '3, 3, 3, 3',
                fieldLabel: i18n.getMsg('export.filename'),
                allowBlank: true,
                editable: true
            }, {
                xtype: 'downloadqueuegrid',
                store: 'downloadqueue-export'
            }]
        }];
        this.callParent(arguments);

        // listeners. Can not be listener at button definition because of scope
        this.down('button[action=export]').on({
            click: me.doExport
        });

        // If no idField can be provided, allow export of all rows only
        if (this.grid.rowtarget.dataIndex === null) {
            this.down('checkbox[name=allrows]').disable();
        }
        if (!this.grid.getSelectionModel().getSelection().length
            || this.grid.rowtarget.dataIndex === null
        ) {
            this.down('checkbox[name=allrows]').setValue(true);
        }

        this.down('button[action=copyGeoJson]').on({
            click: me.doCopy
        });

        // get rowexpander and their columns
        var toggled = false;
        if (!this.grid.plugins) {
            return;
        }
        var preselectedEx = [];
        for (var j = 0; j < this.grid.plugins.length; j++) {
            if (this.grid.plugins[j].ptype === 'gridrowexpander') {
                this.down('checkbox[name=secondarycolumns]').setHidden(false);
                this.rowexp = this.grid.plugins[j];
                var dataset = this.grid.getSelectionModel().getSelection();
                if (dataset.length) {
                    this.secondaryDataIsPrefetched = false;
                    this.getSecondaryData();
                }
                var nodes = this.rowexp.view.getNodes();
                var node = Ext.fly(nodes[0]);
                if (node.hasCls(this.rowexp.rowCollapsedCls) === true) {
                    this.rowexp.toggleRow(0);
                    toggled = true;
                }
                this.expcolumns = this.rowexp.cmps.items[0].getColumns();
                for (var col = 0; col < this.expcolumns.length; col++) {
                    if (this.expcolumns[col].dataIndex &&
                      this.expcolumns[col].dataIndex !== 'readonly') {

                        this.expcolumnList.add({
                            value: this.expcolumns[col].dataIndex,
                            name: this.expcolumns[col].text ||
                                this.expcolumns[i].dataIndex
                        });
                        preselectedEx.push(this.expcolumns[col].dataIndex);
                    }
                }
                if (toggled) {
                    this.rowexp.toggleRow(0);
                }
                break;
            }
        }

        this.down('tagfield[name=exportexpcolumns]').select(preselectedEx);
    },

    doCopy: function(button) {
        var i18n = Lada.getApplication().bundle;
        button.setDisabled(true);
        button.setText(i18n.getMsg('export.button.loading'));
        var me = button.up('window');
        var prefetchCallBack = function() {
            var data = JSON.stringify(me.getGeoJson());
            window.localStorage.setItem('gis-transfer-data', data);
            window.localStorage.setItem(
                'gis-transfer-data-transfer-date', new Date().valueOf());
            button.setText(i18n.getMsg('export.button.copy.success'));
        };
        if (
            me.down('checkbox[name=secondarycolumns]').getValue() &&
            !me.secondaryDataIsPrefetched
        ) {
            me.secondaryDataIsPrefetching.then(
                prefetchCallBack,
                function() {
                    me.showError('export.preloadfailed');
                }
            );
        } else {
            prefetchCallBack();
        }
    },

    /**
     * Asynchronously retrieves secondary rowExpander data in the background
     * data will be written to the this.secondaryData array.
     * The promise will be returned, but also available as
     *  this.secondaryDataIsPrefetching (), the status as boolean
     *  this.secondaryDataIsPrefetched for sync operations (e.g. button status)
     * TODO legacy, still used in "copy geojson"
     */
    getSecondaryData: function() {
        this.secondaryDataIsPrefetched = false;
        var data = this.getDataSets();
        var prm = [];
        var di = this.grid.rowtarget.dataIndex;
        for (var i = 0; i < data.length; i++) {
            var urlString = '';
            switch (this.rowexp.type) {
                case 'Lada.view.grid.Messung':
                    urlString = 'measm?sampleId=' + data[i].get(di);
                    break;
                case 'Lada.view.grid.Messwert':
                    urlString = 'measval?measmId=' + data[i].get(di);
                    break;
            }
            if (urlString) {
                prm.push(
                    // eslint-disable-next-line no-loop-func
                    new Ext.Promise(function(resolve, reject) {
                        Ext.Ajax.request({
                            url: 'lada-server/rest/' + urlString,
                            timeout: 30 * 1000,
                            success: function(response) {
                                resolve(JSON.parse(response.responseText).data);
                            },
                            failure: function() {
                                reject('err.msg.timeout');
                            }
                        });
                    })
                );
            }
        }
        var me = this;
        this.secondaryDataIsPrefetching = new Ext.Promise(
            function(resolve, reject) {
                Ext.Promise.all(prm).then(function(result) {
                    me.secondaryData = result.reduce(function(acc, val) {
                        return acc.concat(val);
                    }, []);
                    me.secondaryDataIsPrefetched = true;
                    resolve();
                }, function(error) {
                    reject(error);
                });
            });
        return this.secondaryDataIsPrefetching;
    },


    /**
     * Evaluates the options set and starts the corresponding export
     */
    doExport: function(button) {
        var win = button.up('window');
        var exportFormat = win.down('combobox[name=formatselection]')
            .getValue();
        if (!exportFormat) {
            win.showError('export.noformat');
            return;
        }
        var filename = win.validateFilename(exportFormat);
        if (!filename) {
            win.showError('export.invalidfilename');
            return;
        }
        var requestData = {};
        if (exportFormat === 'laf') {
            requestData = win.getLAF(filename);
        } else {
            requestData = {
                columns: win.getColumnDefinitions(win),
                exportSubData: win.down('checkbox[name=secondarycolumns]')
                    .getValue(),
                idField: win.grid.rowtarget.dataIndex,
                idFilter: win.getExportIds(win),
                filename: filename,
                subDataColumns: win.getSubdataColumns(win),
                timezone: Lada.util.Date.getCurrentTimeZone()
            };
            switch (exportFormat) {
                case 'laf':
                    win.requestExport(
                        'laf', win.lafRequestURL, requestData, win);
                    break;
                case 'geojson':
                    var data = JSON.stringify(win.getGeoJson());
                    var blob = new Blob([data],
                        {type: 'application/json;charset=utf-8'});
                    saveAs(blob, filename, true);
                    break;
                case 'json':
                    win.requestExport(
                        'json', win.jsonRequestURL, requestData, win);
                    break;
                case 'csv':
                    var colsep = win.down('combobox[name=colsep]').getValue();
                    var decsep = win.down('combobox[name=decsep]').getValue();
                    if (colsep === decsep) {
                        win.showError('export.differentcoldecimal');
                        return;
                    }
                    requestData.subDataColumnNames = win
                        .getSubdataColumNames(requestData.subDataColumns);
                    requestData.csvOptions = {
                        rowDelimiter: win.down('combobox[name=linesep]')
                            .getValue(),
                        fieldSeparator: colsep,
                        decimalSeparator: decsep,
                        quoteType: win.down('combobox[name=textlim]').getValue()
                    };
                    win.requestExport(
                        'csv', win.csvRequestURL, requestData, win);
                    break;
            }
        }
    },
    /**
     * Fetches the data as geojson points with the row's data as properties
     * TODO: legacy (async download of secondary data), but still used for
     * geojson "doCopy"
     */
    getGeoJson: function() {
        var data = this.getDataSets();
        var columns = this.getColumns();
        var resultObj = [];
        if (!columns) {
            this.showError('export.nocolumn');
            return false;
        }
        var expcolumns = this.getColumns(true);
        for (var row = 0; row < data.length; row++) {
            var iresult = {
                type: 'Feature',
                properties: {},
                geometry: {}
            };
            for (var col = 0; col < columns.length; col ++) {
                var c = columns[col];
                if (data[row].get(c.dataIndex) !== undefined) {
                    if (c.dataType && c.dataType.name === 'geom') {
                        var geodata = data[row].get(c.dataIndex);
                        if (geodata) {
                            var realdata = JSON.parse(geodata);
                            iresult.geometry['coordinates'] =
                                realdata.coordinates;
                            iresult.geometry['type'] = realdata.type;
                        }
                    } else {
                        var value = this.formatValue(
                            data[row].get(c.dataIndex), c, true);
                        if (value !== undefined) {
                            iresult.properties[c.text] = value;
                        }
                    }
                }
            }
            if (Ext.Object.isEmpty(iresult.geometry)) {
                iresult.geometry = null;
            }
            var entryId = data[row].get(this.grid.rowtarget.dataIndex);
            if (
                this.rowexp &&
                this.down('checkbox[name=secondarycolumns]').getValue()
            ) {
                var secondaryData = this.setSecondaryJson(entryId, expcolumns);
                if (this.rowexp.type === 'Lada.view.grid.Messung') {
                    iresult.Messungen = secondaryData;
                } else if (this.rowexp.type === 'Lada.view.grid.Messwert') {
                    iresult.Messwerte = secondaryData;
                }
            }
            resultObj.push(iresult);
        }
        return {
            'type': 'FeatureCollection',
            'features': resultObj
        };
    },

    /**
     * prepares and initiates a request for probe-LAF, or, if available,
     * messung-LAF
     * @param filename
     */
    getLAF: function(filename) {
        var dataset = this.getDataSets();
        var jsondata = {
            filename: filename
        };
        if (this.hasMessung) {
            jsondata.messungen = [];
            for (var i = 0; i < dataset.length; i++) {
                var mid = dataset[i].get(this.hasMessung);
                if (Array.isArray(mid)) {
                    for (var j = 0; j < mid.length; j++) {
                        jsondata.messungen.push(mid[j]);
                    }
                } else {
                    jsondata.messungen.push(mid);
                }
            }
            if (!jsondata.messungen.length) {
                this.showError('export.nodata');
                return false;
            }
        } else if (this.hasProbe) {
            jsondata.proben = [];
            for (var k = 0; k < dataset.length; k++) {
                var pid = dataset[k].get(this.hasProbe);
                jsondata.proben.push(pid);
            }
            if (!jsondata.proben.length) {
                this.showError('export.nodata');
                return false;
            }
        } else { //should not happen
            this.showError('export.wrongformat');
            return false;
        }
        this.requestExport('laf', this.lafRequestUrl, jsondata);
    },

    /**
     * initiates an export request, adds it to the export downloadQueue
     * @param {*} type e.g. 'laf', 'csv', 'json'
     * @param {*} url the url used for the request
     * @param {*} data preptared json payload
     * @param {*} scope optional scope ('this')
     */
    requestExport: function(type, url, data, scope) {
        var queueItem = this.controller.addQueueItem(data.filename, 'export');
        var me = scope || this;
        Ext.Ajax.request({
            url: url,
            jsonData: data,
            headers: {
                'X-FILE-ENCODING': me.down('combobox[name=encoding]').getValue()
            },
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText, true);
                if (json) {
                    if (json.refId) {
                        queueItem.set('refId', json.refId);
                        queueItem.set('status', 'waiting');
                    } else {
                        queueItem.set('status', 'error');
                    }

                    if (json.error) {
                        queueItem.set('message', json.error );
                    } else {
                        queueItem.set('message', '' );
                    }
                } else {
                    // TODO: Handle SSO HTML form like in
                    // RestProxy.processResponse
                    queueItem.set('done', true);
                    queueItem.set('status', 'error');
                }
            },
            failure: function(response) {
                queueItem.set('done', true);
                queueItem.set('status', 'error');

                var msg = response.responseText;
                if (!msg) {
                    var i18n = Lada.getApplication().bundle;
                    msg = response.timedout
                        ? i18n.getMsg('err.msg.timeout')
                        : response.statusText;
                }
                queueItem.set('message', msg);
            }
        });
    },

    /**
     * change the GUI as another export format is selected
     */
    changeFormat: function(box, newValue) {
        var win = box.up('window');
        win.down('fieldset[name=csvoptions]').setVisible(newValue === 'csv');
        win.resetCopyButton(win);

        win.down('button[action=copyGeoJson]').setVisible(
            newValue === 'geojson');

        win.down('combobox[name=encoding]').setVisible(
            newValue === 'csv' || newValue === 'laf');

        win.down('checkbox[name=allrows]').setVisible(newValue !== 'laf');
        var ecolVisible = true;
        if (win.down('checkbox[name=allcolumns]').getValue()) {
            ecolVisible = false;
        }
        if (newValue === 'laf') {
            ecolVisible = false;
            win.down('checkbox[name=allcolumns]').setVisible(false);
            win.down('checkbox[name=secondarycolumns]').setVisible(false);
        } else {
            win.down('checkbox[name=allcolumns]').setVisible(true);
            if (win.rowexp) {
                win.down('checkbox[name=secondarycolumns]').setVisible(true);
            }
        }
        win.down('tagfield[name=exportcolumns]').setVisible(ecolVisible);
    },

    exportallcolumntoggle: function(box, newValue) {
        var me = box.up('window');
        me.down('tagfield[name=exportcolumns]').setVisible(
            !newValue);
        if (
            me.rowexp &&
            me.down('checkbox[name=secondarycolumns]').getValue()
        ) {
            me.down('tagfield[name=exportexpcolumns]').setVisible(!newValue);
        }
        me.resetCopyButton(me);
    },

    exportsecondarytoggle: function(box, newValue) {
        var me = box.up('window');
        var expButton = me.down('button[action=export]');
        if (newValue && !me.down('checkbox[name=allcolumns]').getValue()) {
            me.down('tagfield[name=exportexpcolumns]').setVisible(
                !me.down('checkbox[name=allcolumns]').getValue()
            );
        } else {
            me.down('tagfield[name=exportexpcolumns]').setVisible(false);
        }
        expButton.setDisabled(false);
        me.resetCopyButton(me);
    },

    /**
     * Prepares the data selected
     */
    getDataSets: function() {
        var dataset = this.grid.getSelectionModel().getSelection();
        if (!dataset.length) {
            this.showError('export.nodata');
            this.close();
        }
        return dataset;
    },

    getColumns: function(sec) {
        var allcolumns = this.down('checkbox[name=allcolumns]').getValue();
        var columnlist = [];
        var cols = [];
        if (sec) {
            cols = this.expcolumns;
        } else {
            cols = this.grid.getColumns();
        }
        var exportcols = null;
        if (sec) {
            exportcols = this.down('tagfield[name=exportexpcolumns]')
                .getValue();
        } else {
            exportcols = this.down('tagfield[name=exportcolumns]').getValue();
        }
        for (var i = 0; i < cols.length; i ++) {
            if (!cols[i].dataIndex || cols[i].dataIndex === 'readonly') {
                continue;
            }
            if (allcolumns || exportcols.indexOf(cols[i].dataIndex) > -1) {
                columnlist.push(cols[i]);
            }
        }
        return columnlist;
    },

    showError: function(message) {
        var i18n = Lada.getApplication().bundle;
        var text = '';
        var title = i18n.getMsg('export.failed');
        if (!message) {
            text = i18n.getMsg('export.failednoreason');
        } else {
            text = i18n.getMsg(message);
        }

        var window = Ext.ComponentQuery.query('window[title=' + title + ']');
        if (window.length) {
            return;
        }
        Ext.create('Ext.window.Window', {
            title: title,
            modal: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                html: text,
                margin: '10, 5, 5, 5'
            }, {
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    margin: '5,5,5,5'
                },
                items: [{
                    xtype: 'button',
                    text: i18n.getMsg('export.continue'),
                    margin: '5, 0, 5, 5',
                    handler: function(button) {
                        button.up('window').close();
                    }
                }]
            }]
        }).show();
    },

    /**
     * formats the (originally string) value according to the data type defined
     * in the database. Optional parameter 'json' returns dates as Date,
     * regardless of format string
     */
    formatValue: function(value, column, json) {
        if (!column || value === undefined || value === null ) {
            return null;
        }
        if (!column.dataType) {
            /** This section contains special treatment for probe items. Probe
            grids are supposed to be "dynamic grid', but don't contain poperly
            formatted dataTypes. Some fields may be thought of as to be
            exported as displayed, as real data.
            TODO: check for obsoleteness. Mar 2018*/
            if (column.dataIndex === 'messzeitpunkt' && !column.dataType) {
                return new Date(value);
            }
            var store, record, r;
            if (column.dataIndex === 'sampleMethId') {
                store = Ext.data.StoreManager.get('probenarten');
                record = store.getById(value);
                if (record) {
                    r = record.get('probenart');
                    return r || '';
                }
                return '';
            }
            /** end of (hopefully temporary) section */
            if (column.dataIndex === 'messgroesseId') {
                store = Ext.data.StoreManager.get('messgroessen');
                record = store.getById(value);
                if (record) {
                    r = record.get('name');
                    return r || '';
                }
                return '';
            }
            if (column.dataIndex === 'mehId') {
                store = Ext.data.StoreManager.get('messeinheiten');
                record = store.getById(value);
                if (record) {
                    r = record.get('unitSymbol');
                    return r || '';
                }
                return '';
            }
            if (column.dataIndex === 'statusKombi') {
                store = Ext.data.StoreManager.get('statuskombi');
                record = store.getById(value);
                if (record) {
                    r = record.data.statusStufe.stufe +
                        ' ' +
                        record.data.statusWert.wert;
                    return r || '';
                }
                return '';
            }
            return value;
        }
        switch (column.dataType.name) {
            case 'number':
                if (!value && value !== 0) {
                    return null;
                }
                return parseFloat(value);
            case 'date':
                if (column.dataType.format && !json) {
                    return Lada.util.Date.formatTimestamp(
                        value, column.dataType.format, true
                    );
                } else {
                    return new Date(value);
                }
            case 'geom':
                return value;
            case 'text':
                return value;
            case 'probeId':
            case 'messungId':
            case 'ortId':
                return value;
            case 'statuskombi':
                store = Ext.data.StoreManager.get('statuskombi');
                record = store.getById(value);
                if (record) {
                    r = record.data.statusLev.lev +
                        ' ' +
                        record.data.statusVal.val;
                    return r || '';
                }
                return '';
            default:
                return value.toString();
        }
    },

    /**
     * Validation of filename input. Returns the valid filename, 'export' if
     * textfield is empty or "false" if the text is invalid.
     * Appends the extension if not already present
     */
    validateFilename: function(defaultending) {
        var defaultend = defaultending || 'txt';
        var fname = this.down('textfield[name=filename]').getValue();
        if (!fname) {
            fname = 'export.' + defaultend;
        }
        //TODO better regex: this is quite basic
        var pattern = new RegExp(/^(\w|[-äöüß])+(\w|\.|\s|[äüöß])*[^\W\.]$/i);
        if (!pattern.test(fname)) {
            this.showError('export.invalidfilename');
            return false;
        } else {
            // fname may be shorter than ending
            if (
                (fname.length > defaultend.length + 1) &&
                fname.toLowerCase().indexOf(defaultend.toLowerCase()) ===
                    (fname.length - defaultend.length)
            ) {
                return fname;
            } else {
                return fname + '.' + defaultend;

            }
        }
    },

    /**
     * Adds the rowExpander data by sending an AJAX request; the resultobject
     * will be ammended asynchronously after an answer is received.
     * @param {*} parentId Number/String to find the original record entry in
     * the resultobject
     * @param {*} columns Columns to be included
     * TODO: legacy. Can be removed if getGeoJson is removed
     */
    setSecondaryJson: function(parentId, columns) {
        var secondaryData = [];
        var me = this;
        switch (me.rowexp.type) {
            case 'Lada.view.grid.Messung':
                secondaryData = me.secondaryData.filter(function(entry) {
                    return entry.probeId === parentId;
                });
                break;
            case 'Lada.view.grid.Messwert':
                secondaryData = me.secondaryData.filter(function(entry) {
                    return entry.messungsId === parentId;
                });
        }
        var content = [];
        for (var j = 0; j < secondaryData.length; j++) {
            var item = {};
            // eslint-disable-next-line no-loop-func
            Object.keys(secondaryData[j]).forEach(function() {
                for (var i = 0; i < columns.length; i++) {
                    var di = columns[i].dataIndex;
                    if (di) {
                        item[di] = secondaryData[j][di];
                    }
                }
            });
            content.push(item);
        }
        return content;
    },

    getExportIds: function(win) {
        if (win.down('checkbox[name=allrows]').getValue()) {
            return [];
        } else {
            var selection = this.grid.getSelectionModel().getSelection();
            if (selection.length) {
                var di = this.grid.rowtarget.dataIndex;
                return Ext.Array.map(selection, function(e) {
                    return e.get(di);
                });
            } else {
                win.showError('export.noselection');
            }
        }
    },

    getSubdataColumns: function(win) {
        if (!win.down('checkbox[name=secondarycolumns]').getValue()) {
            return null;
        }
        var expColumns = win.expcolumnList.getData().items;
        if (!win.down('checkbox[name=allcolumns]').getValue()) {
            var tagCols = win.down('tagfield[name=exportexpcolumns]')
                .getValue();
            expColumns = Ext.Array.filter(expColumns, function(col) {
                return tagCols.indexOf(col.get('value')) >= 0;
            });
        }
        return Ext.Array.map(expColumns, function(c) {
            return c.get('value');
        });
    },

    /**
     * Get readable names for the given columns
     * @param {String[]} columns Column data index array
     * @return {Object} Object containing dataIndex: columnName
     */
    getSubdataColumNames: function(columns) {
        if (!columns) {
            return null;
        }
        var i18n = Lada.getApplication().bundle;
        var names = {};
        Ext.Array.forEach(columns, function(column) {
            names[column] = i18n.getMsg(column);
        });
        return names;
    },

    getColumnDefinitions: function(win) {
        var allcolumns = win.down('checkbox[name=allcolumns]').getValue();
        var expcolumns = win.down('tagfield[name=exportcolumns]').getValue();
        var columnstore = Ext.data.StoreManager.get('columnstore');
        var genericResults = Ext.StoreManager.get('genericresults');
        var cols = genericResults.getProxy().payload;
        if (!cols || !cols.length) {
            return [];
        }
        cols = cols.sort(function(a, b) {
            return a.colIndex - b.colIndex;
        });
        return Ext.Array.map(cols, function(c) {
            c.export = false;
            if ( c.colIndex > -1 && c.isVisible !== false) {
                var gridColumn = columnstore.findRecord(
                    'id', c.gridColMpId, 0, false, false, true
                );
                if (
                    allcolumns ||
                    expcolumns.indexOf(gridColumn.get('dataIndex')) > -1
                ) {
                    c.export = true;
                }
            }
            delete c.isVisible;
            return c;
        });
    },

    resetCopyButton: function(scope) {
        var button = scope.down('button[action=copyGeoJson]');
        if (
            scope.down('combobox[name=formatselection]').getValue() ===
                'geojson'
        ) {
            button.setVisible(true);
            button.setDisabled(false);
        } else {
            button.setVisible(false);
        }
    }

});
