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

    collapsible: true,
    maximizable: true,
    autoShow: true,
    layout: 'vbox',
    align: 'stretch',
    grid: null,

    /**
     * CSV options (separators etc), set by dialogue. TODO: write config here
     */
    csv: {},

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

    // Counter to keep track of asynchronous actions
    totalentries: 0,
    parsedEntries: 0,

    /**
     *Initializ the Window and the options available
     */
    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('export.title');
        var columns = this.grid.getColumns();

        // add CSV export options

        this.csv_linesepstore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: i18n.getMsg('lineseparator.windows'),
                value: 'windows'
            },{
                name: i18n.getMsg('lineseparator.linux'),
                value: 'linux'
            }]
        });
        this.csv_textlimstore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: i18n.getMsg('doublequotes'),
                value: '"'
            }, {
                name: i18n.getMsg('singlequotes'),
                value: '\''
            }]
        });

        this.csv_colsepstore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: i18n.getMsg('semicolon'),
                value: ';'
            }, {
                name: i18n.getMsg('comma'),
                value: ','
            },{
                name: i18n.getMsg('whitespace'),
                value: ' '
            }, {
                name: i18n.getMsg('dot'),
                value: '.'
            }]
        });

        this.csv_decSepStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: i18n.getMsg('comma'),
                value: ','
            },{
                name: i18n.getMsg('dot'),
                value: '.'
            }]
        });

        var columnslist= [];
        var preselected= [];
        for (var i =0; i < columns.length; i++) {
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
        this.columnListStore = Ext.create('Ext.data.Store',{
            fields: ['name', 'value'],
            data: columnslist
        });

        //store for additional rowExpander columns
        this.expcolumnList = Ext.create('Ext.data.Store',{
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
            layout: 'vbox',
            align: 'stretch',
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
                    change: me.exportalltoggle
                }
            }, {
                xtype: 'checkbox',
                name: 'secondarycolumns',
                fieldLabel: i18n.getMsg('export.secondarycolumns'),
                checked: this.grid.export_rowexp ? true: false,
                listeners: {
                    change: me.exportsecondarytoggle
                }
            }, {
                xtype: 'tagfield',
                name: 'exportcolumns',
                labelWidth: 100,
                fieldLabel: i18n.getMsg('export.columns'),
                store: me.columnListStore,
                hidden: true,
                value: preselected,
                multiSelect: true
            }, {
                xtype: 'tagfield',
                name: 'exportexpcolumns',
                labelWidth: 100,
                fieldLabel: i18n.getMsg('export.expcolumns'),
                store: me.expcolumnList,
                hidden: true,
                value: null,
                multiSelect: true
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
                })
            }, {
                xtype: 'fieldset',
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
                    value: '"'
                }, {
                    xtype: 'combobox',
                    name: 'colsep',
                    fieldLabel: i18n.getMsg('export.columnlim'),
                    store: me.csv_colsepstore,
                    value: ';'
                }, {
                    xtype: 'combobox',
                    name: 'decsep',
                    store: me.csv_decSepStore,
                    fieldLabel: i18n.getMsg('decimalseparator'),
                    value: ','
                }]
            }, {
                xtype: 'textfield',
                name: 'filename',
                margin: '3, 3, 3, 3',
                fieldLabel: i18n.getMsg('export.filename'),
                allowBlank: true,
                editable: true
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                margin: '5,5,5,5'
            },
            items: [{
                xtype: 'button',
                action: 'export',
                text: i18n.getMsg('export.button')
            },{
                xtype: 'button',
                action: 'close',
                text: i18n.getMsg('close')
            }]
        }];
        this.callParent(arguments);

        // listeners. Can not be listener at button definition because of scope
        this.down('button[action=export]').on({
            click: me.doExport
        });
        this.down('button[action=close]').text = i18n.getMsg('close');
        this.down('button[action=export]').text = i18n.getMsg('export.button');
        this.down('button[action=close]').on({
            click: function(button) {
                button.up('window').close();
                return;
            }
        });

        // get rowexpander and their columns
        var toggled = false;
        if (!this.grid.plugins) {
            return;
        }
        var preselectedEx = [];
        for (var i=0; i < this.grid.plugins.length; i++) {
            if (this.grid.plugins[i].ptype === 'gridrowexpander') {
                this.rowexp = this.grid.plugins[i];
                var nodes = this.rowexp.view.getNodes();
                var node = Ext.fly(nodes[0]);
                if (node.hasCls(this.rowexp.rowCollapsedCls) === true) {
                    this.rowexp.toggleRow(0);
                    toggled = true;
                }
                this.expcolumns = this.rowexp.cmps.items[0].getColumns();
                for (var i =0; i < this.expcolumns.length; i++) {
                    if (this.expcolumns[i].dataIndex &&
                      columns[i].dataIndex !== 'readonly' &&
                      this.expcolumns[i].text.length) {
                        this.expcolumnList.add({
                            value: this.expcolumns[i].dataIndex,
                            name: this.expcolumns[i].text
                        });
                        preselectedEx.push(this.expcolumns[i].dataIndex);
                    }
                }
                if (toggled) {
                    this.rowexp.toggleRow(0);
                }
                break;
            }
        }

        this.down('button[action=export]').text= i18n.getMsg('export.button');
        this.down('tagfield[name=exportexpcolumns]').select(preselectedEx);
        var encoding = document.characterSet;
        if (!encoding) {
            encoding = document.defaultCharset;
        }
        this.down('combobox[name=encoding]').setValue(encoding.toLowerCase());
    },

    /**
     * Evaluates the options set and starts the corresponding export
     */
    doExport: function(button) {
        var win = button.up('window');
        win.exportformat = win.down('combobox[name=formatselection]').getValue();
        var filename = '';
        var encoding = win.down('combobox[name=encoding]').getValue();
        switch (win.exportformat) {
            case 'json':
                var namecheck = win.validateFilename('json');
                if (namecheck) {
                    win.down('button[action=close]').setDisabled(true);
                    win.exportJson(encoding);
                }
                break;
            case 'geojson':
                var namecheck = win.validateFilename('geojson');
                if (namecheck) {
                    win.down('button[action=close]').setDisabled(true);
                    win.exportGeoJson(encoding);
                }
                break;
            case 'csv':
                var namecheck = win.validateFilename('csv');
                if (namecheck) {
                    win.down('button[action=close]').setDisabled(true);
                    win.exportCSV(encoding);
                }
                break;
            case 'laf':
                namecheck = win.validateFilename('laf');
                if (namecheck) {
                    win.down('button[action=close]').setDisabled(true);
                    win.exportLAF(encoding);
                }
                break;
            default:
                win.showError('export.noformat');
        }
    },

    /**
    * Exports the table data as json objects
    */
    exportJson: function(encoding) {
        var data = this.getDataSets();
        if (data) {
            var columns = this.getColumns();
            var expcolumns = this.getColumns(true);
            if (!columns) {
                this.showError('export.nocolumn');
                return false;
            }
            this.resultobject = {};
            for (var i=0; i < data.length; i++ ) {
                var iresult = {};
                for (var col = 0; col < columns.length; col ++ ) {
                    var c = columns[col];
                    if (c && data[i].get(c.dataIndex) !== undefined ) {
                        var value = this.formatValue(
                            data[i].get(c.dataIndex), c, true);
                        iresult[c.dataIndex] = value;
                    }
                }
                var entryId = data[i].get(this.grid.rowtarget.dataIndex);
                this.resultobject[entryId] = iresult;
                if (this.rowexp) {
                    this.setSecondaryJson(data[i], 'json', entryId, expcolumns);
                } else {
                    this.countDown('utf-8');
                }
            }
            return true;
        } else {
            this.showError('export.nodata');
            return false;
        }
    },

    /**
     * Exports the geometry as geojson points with the table data as properties
     */
    exportGeoJson: function() {
        var data = this.getDataSets();
        if (data) {
            var columns = this.getColumns();
            if (!columns) {
                this.showError('export.nocolumn');
                return false;
            }
            var expcolumns = this.getColumns(true);
            this.resultobject = {
                type: 'FeatureCollection',
                features: []
            };
            for (var i=0; i < data.length; i++) {
                var iresult = {
                    type: 'Feature',
                    properties: {},
                    geometry: {}
                };
                for (var col = 0; col < columns.length; col ++) {
                    var c = columns[col];
                    if (data[i].get(c.dataIndex) !== undefined) {
                        if (c.dataType && c.dataType.name === 'geom') {
                            var geodata = data[i].get(c.dataIndex);
                            if (geodata) {
                                var realdata = JSON.parse(geodata);
                                iresult.geometry['coordinates'] = realdata.coordinates;
                                iresult.geometry['type'] = realdata.type;
                            }
                        } else {
                            var value = this.formatValue(
                                data[i].get(c.dataIndex), c, true);
                            if (value !== undefined) {
                                iresult.properties[c.dataIndex] = value;
                            }
                        }
                    }
                }
                this.resultobject.features.push(iresult);
                if (this.rowexp) {
                    this.setSecondaryJson(data[i],
                        this.resultobject.features[i].properties, 'geojson',
                        data[i].get(this.grid.rowtarget.dataIndex),
                        expcolumns);
                } else {
                    this.countDown('utf-8');
                }
            }
            return true;
        } else {
            this.showError('export.nodata');
            return false;
        }
    },

    /**
     * Exports the table data as csv files, with header.
     */
    exportCSV: function(encoding) {
        var data = this.getDataSets();
        if (data) {
            var lineseptype = this.down('combobox[name=linesep]').getValue();
            this.csv.linesep = '\r\n';
            if (lineseptype === 'linux') {
                this.csv.linesep = '\n';
            }
            this.csv.colsep = this.down('combobox[name=colsep]').getValue();
            this.csv.decsep = this.down('combobox[name=decsep]').getValue();
            this.csv.textsep = this.down('combobox[name=textlim]').getValue();
            // validate csv options
            if (!this.csv.linesep ||
              !this.csv.colsep ||
              !this.csv.decsep) {
                this.showError('export.missingvaluescsv');
                return false;
            }
            if (this.csv.colsep === this.csv.decsep) {
                this.showError('export.differentcoldecimal');
                return false;
            }
            // create header
            var expcolumns = [];
            if ( this.down('checkbox[name=secondarycolumns]').value) {
                expcolumns = this.getColumns(true);
            }
            var columns = this.getColumns();
            if (!columns.length && !expcolumns.length) {
                this.showError('export.nocolumn');
                return false;
            }
            this.resultobject = this.csv.textsep;

            if (columns.length) {
                this.resultobject += columns[0].text + this.csv.textsep;
            } else if (expcolumns.length) {
                this.resultobject += expcolumns[0].text + this.csv.textsep;
            }
            for (var col = 1; col < columns.length; col ++) {
                this.resultobject += this.csv.colsep + this.csv.textsep +
                    columns[col].text + this.csv.textsep;
            }
            var col_i = 0;
            if (!columns.length && expcolumns.length) {
                col_i = 1;
            }
            for (col_i; col_i < expcolumns.length; col_i ++) {
                this.resultobject += this.csv.colsep + this.csv.textsep +
                    expcolumns[col_i].text + this.csv.textsep;
            }
            this.resultobject += this.csv.linesep;

            //iterate through entries
            var me = this;
            for (var entry = 0; entry < data.length; entry++ ) {
                var entryline = me.addline(data[entry], columns);

                if (expcolumns.length) {
                    me.setSecondaryCsv(data[entry], expcolumns, entryline);
                } else {
                    this.resultobject += entryline + this.csv.linesep;
                    this.countDown(encoding);
                }

            }
            return true;

        } else {
            this.showError('export.nodata');
            return false;
        }

    },

    /**
     * Exports as probe-LAF, or, if available, as messung-LAF
     */
    exportLAF: function(encoding) {
        var dataset = this.getDataSets();
        var jsondata = {};
        if (this.hasMessung) {
            jsondata.messungen = [];
            for (var i = 0; i < dataset.length; i++) {
                var mid = dataset[i].get(this.hasMessung);
                if (Array.isArray(mid)) {
                    for (var j=0; j < mid.length; j++) {
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
            for (var i= 0; i < dataset.length; i++) {
                var pid = dataset[i].get(this.hasProbe);
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
        var me = this;
        Ext.Ajax.request({
            url: 'lada-server/data/export/laf',
            jsonData: jsondata,
            headers: {
                'X-FILE-ENCODING': encoding
            },
            responseType: 'arraybuffer',
            binary: true,
            timeout: 2 * 60 * 1000,
            success: function(response) {
                var data = response.responseBytes;
                me.exportFile(data, {type: 'text/plain;charset=' + encoding});
                return true;
            },
            failure: function(response) {
                /* SSO will send a 302 if the Client is not authenticated
                unfortunately this seems to be filtered by the browser.
                We assume that a 302 was send when the follwing statement
                is true.
                */
                if (response.status === 0 &&
                  response.getResponse().responseText === '') {
                    Ext.MessageBox.confirm('Erneutes Login erforderlich',
                        'Ihre Session ist abgelaufen.<br/>'+
                        'Für ein erneutes Login muss die Anwendung neu geladen werden.<br/>' +
                        'Alle ungesicherten Daten gehen dabei verloren.<br/>' +
                        'Soll die Anwendung jetzt neu geladen werden?', this.reload);
                } else {
                    me.showError();
                    return false;
                }
            }
        });
    },

    /**
     * change the GUI as another export format is selected
     */
    changeFormat: function(box, newValue, oldValue) {
        box.up('window').down('fieldset[name=csvoptions]').setVisible(
            newValue === 'csv' ? true: false
        );
        box.up('window').down('combobox[name=encoding]').setVisible(
            newValue === 'csv' || newValue === 'laf' ? true: false
        );
        var ecolVisible = true;
        if (box.up('window').down('checkbox[name=allcolumns]').getValue()) {
            ecolVisible = false;
        }
        if (newValue === 'laf') {
            ecolVisible = false;
        }
        box.up('window').down('tagfield[name=exportcolumns]').setVisible(
            ecolVisible);
    },

    exportalltoggle: function(box, newValue, oldValue) {
        var me = box.up('window');
        me.down('tagfield[name=exportcolumns]').setVisible(
            !newValue);
        if (me.rowexp && me.down('checkbox[name=secondarycolumns]').value) {
            me.down('tagfield[name=exportexpcolumns]').setVisible(!newValue);
        }
    },

    exportsecondarytoggle: function(box, newValue, oldValue) {
        var me = box.up('window');
        me.down('checkbox[name=allcolumns]');
        if (newValue && !me.down('checkbox[name=allcolumns]').value) {
            me.down('tagfield[name=exportcolumns]').setVisible(true);
        } else {
            me.down('tagfield[name=exportcolumns]').setVisible(false);
        }
    },


    /**
     * Saves the resulting data
     */
    exportFile: function(data, encoding) {
        var blob = new Blob([data], encoding);
        saveAs(blob, this.filename, true);
        this.close();
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
        this.totalentries = dataset.length;
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
            exportcols = this.down('tagfield[name=exportexpcolumns]').getValue();
        } else {
            exportcols = this.down('tagfield[name=exportcolumns]').getValue();
        }
        for (var i=0; i < cols.length; i ++) {
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
        if (!message) {
            text = i18n.getMsg('export.failednoreason');
        } else {
            text = i18n.getMsg(message);
        }
        Ext.create('Ext.window.Window', {
            title: i18n.getMsg('export.failed'),
            modal: true,
            layout: 'vbox',
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
            if (column.dataIndex === 'probenartId') {
                var store = Ext.data.StoreManager.get('probenarten');
                var record = store.getById(value);
                if (record) {
                    var r = record.get('probenart');
                    return r || '';
                }
                return '';
            }
            /** end of (hopefully temporary) section */

            return value;
        }
        switch (column.dataType.name) {
            case 'number':
                if (!value && value !== 0) {
                    return null;
                }
                if (value.indexOf('<') === 0) {
                    // TODO better handling of '<'. it really is a 0 with
                    // additional info, but it is a string, not a number
                    return value;
                }
                return Number.parseFloat(value);
            case 'date':
                if (column.dataType.format && !json) {
                    return Ext.Date.format(new Date(value),
                        column.dataType.format);
                } else {
                    return new Date(value);
                }
            case 'geom':
                return value;
            case 'text':
            case 'probeId':
            case 'messungId':
            case 'ortId':
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
        var pattern = new RegExp(/^(\w|[äöüß])+(\w|\.|\s|[äüöß])*[^\W\.]$/i);
        if (!pattern.test(fname)) {
            this.showError('export.invalidfilename');
            return false;
        } else {
            if (fname.length > defaultend.length && // fname may be shorter than ending
                fname.toLowerCase().indexOf(defaultend.toLowerCase()) ===
                    fname.length - defaultend.length) {
                this.filename = fname;
                return true;
            } else {
                this.filename = fname + '.' + defaultend;
                return true;
            }
        }
    },

    /**
     * Adds the rowExpander data by sending an AJAX request; the resultobject
     * will be ammended asynchronously after an answer is received.
     * @param {*} entry The record of the row.
     * @param {*} type String ("json" or "geojson") to determine where in the
     * resultobject data is written to.
     * @param {*} idx Number/String to find the original record entry in the
     * resultobject
     * @param {*} columns Columns to be included
     */
    setSecondaryJson: function(entry, type, idx, columns) {
        if (!this.rowexp || !this.down('checkbox[name=secondarycolumns]').value) {
            this.countDown();
            return;
        }
        var me = this;
        var fillData = function(content) {
            var results = [];
            if (content) {
                Object.keys(content).forEach(function(key) {
                    var result = {};
                    for (var i=0; i< columns.length; i++) {
                        var di = columns[i].dataIndex;
                        if (di) {
                            result[di] = content[key][di];
                        }
                    }
                    results.push(result);
                });
                return results;
            } else {
                return [];
            }
        };
        switch (this.rowexp.type) {
            case 'Lada.view.grid.Messung':
                Ext.Ajax.request({
                    url: 'lada-server/rest/messung?probeId=' + idx,
                    timeout: 5 * 1000,
                    success: function(response) {
                        var content = JSON.parse(response.responseText);
                        if (type === 'json') {
                            me.resultobject[idx].Messungen =
                                fillData(content.data);
                        } else if (type === 'geojson') {
                            me.resultobject.features[idx].Messungen =
                                fillData(content.data);
                        }
                        me.countDown();
                    },
                    failure: function() {
                        //TODO error handling.
                        me.countDown();
                        return null;
                    }
                });
                break;
            case 'Lada.view.grid.Messwert':
                Ext.Ajax.request({
                    url: 'lada-server/rest/messwert?messungId=' + idx,
                    timeout: 5 * 1000,
                    success: function(response) {
                        var content = JSON.parse(response.responseText);
                        if (type === 'json') {
                            me.resultobject[idx].Messwerte =
                                fillData(content.data);
                        } else if (type === 'geojson') {
                            me.resultobject.features[idx].Messwerte =
                                fillData(content.data);
                        }
                        me.countDown();
                    },
                    failure: function() {
                        //TODO error handling.
                        me.countDown();
                        return null;
                    }
                });
                break;
            default:
                me.countDown();
                return null;
        }
    },

    /**
     * asynchronously adds one csv line per subentry in the rowexpander.
     * @param item the original item of the grid
     * @param columns the columns to be added
     * @param primaryRow The prepared part of the csv which adds (redundant)
     * information for all subitems
     */
    setSecondaryCsv: function(item, columns, primaryRow) {
        var me = this;
        if (!this.rowexp || !this.down('checkbox[name=secondarycolumns]').value ) {
            this.countDown();
            return;
        }
        var id = item.get(this.grid.rowtarget.dataIndex);
        var successCallback = function(response) {
            var content = JSON.parse(response.responseText);
            var line = '';
            if (content.data) {
                Object.keys(content.data).forEach(function(key) {
                    line += primaryRow
                    + me.addline(content.data[key], columns)
                    + me.csv.linesep;
                });
            } else {
                line += primaryRow;
                for (var col=0; col < columns.length - 1; col++) {
                    line += me.csv.colsep;
                }
                line += me.csv.linesep;
            }
            me.resultobject += line;
            me.countDown();
        };
        switch (this.rowexp.type) {
            case 'Lada.view.grid.Messung':
                Ext.Ajax.request({
                    url: 'lada-server/rest/messung?probeId=' + id,
                    timeout: 5 * 1000,
                    success: successCallback,
                    failure: function() {
                        me.countDown();
                        //TODO error handling.
                        return null;
                    }
                });
                break;
            case 'Lada.view.grid.Messwert':
                Ext.Ajax.request({
                    url: 'lada-server/rest/messwert?messungsId=' + id,
                    timeout: 5 * 1000,
                    success: successCallback,
                    failure: function() {
                        //TODO error handling.
                        me.countDown();
                        return null;
                    }
                });
                break;
            default:
                me.countDown();
                return null;
        }
    },

    /**
     * Creates a partial csv line based on the columns and csv parameters specified
     * @param record The data record to use. May be an Ext.data.model or a
     * javascript object
     * @param columns A prepared list of column definitions extracted from a grid
     */
    addline: function(record, columns) {
        var line = '';
        for (var col = 0; col < columns.length; col++ ) {
            var newvalue = null;
            if (record.get) {
                newvalue = record.get(columns[col].dataIndex);
            } else { // not an extJS model, but a direct json object
                newvalue = record[columns[col].dataIndex];
            }
            line += col > 0 ? this.csv.colsep: '';
            var value = this.formatValue(newvalue, columns[col], false);
            switch ( typeof(value) ) {
                case 'number':
                    value = value.toString();
                    if (this.csv.decsep === ',' && value.indexOf('.') > -1) {
                        value.replace(/'.'/g, ',');
                    }
                    line += value;
                    break;
                case 'undefined': //leave column empty
                    break;
                case 'string':
                    if (value.indexOf(this.textsep) > -1 ) {
                        // This will alter the data exported
                        // (exchanging single/double quotes)
                        var i18n = Lada.getApplication().bundle;

                        var oldChar;
                        var newChar;
                        if (this.textsep === '"') {
                            value.replace(/\"/g, '\'');
                            oldChar = '"';
                            newChar = '\'';
                        } else {
                            oldChar= '\'';
                            newChar = '"';
                            value.replace(/\'"'/g, '"');
                        }
                        if (!this.csv_asked) {
                            this.csv_asked = true;
                            var warntext = i18n.getMsg('warn.msg.export.csv.stringseparator', oldChar, newChar);
                            var win = Ext.create('Ext.window.Window', {
                                title: i18n.getMsg('warn'),
                                items: [{
                                    xtype: 'panel',
                                    margin: '5 5 0 5',
                                    bodyStyle: 'background: none; border: none',
                                    html: warntext
                                }, {
                                    xtype: 'button',
                                    margin: '5 5 5 5',
                                    text: i18n.getMsg('ok'),
                                    handler: function(button) {
                                        button.up().close();
                                    }
                                }]
                            });
                            win.show();
                        }
                    }
                    line += this.csv.textsep + value + this.csv.textsep;
                    break;
                case 'object':
                // may be an unformatted date. Try
                // converting it into a string.
                    var val = '';
                    try {
                        var isostring = value.toISOString();
                        val = this.csv.textsep + isostring + this.csv.textsep;
                    } catch (err) {
                        val = '';
                    }
                    line += val;
                    break;
                case 'boolean': // convert into 1 and 0
                    if (value) {
                        line += '1';
                    } else {
                        line += '0';
                    }
                    break;
                default:
                    console.log('Fehler: Kein Exportformat für ' +
                        typeof(value) + ' definiert.');
            }
        }
        return line;
    },

    /**
    * Keeps track of how many data still needs to be parsed, and saves the data
    * to file upon completion. Is not yet used by LAF export (as there are no
    * multiple queries at the same time.
    */
    countDown: function(encoding) {
        this.parsedEntries += 1;
        if (this.parsedEntries < this.totalentries) {
            return;
        }
        var data = '';
        switch (this.exportformat) {
            case 'json':
                data = JSON.stringify(this.resultobject);
                this.exportFile(data, {type: 'text/json;charset=' + encoding});
                break;
            case 'geojson':
                data = JSON.stringify(this.resultobject);
                this.exportFile(data, {type: 'text/json;charset=' + encoding});
                break;
            case 'csv':
                data = this.resultobject;
                if (encoding !== 'utf-8') {
                    var rawLength = data.length;
                    var array = new Uint8Array(new ArrayBuffer(rawLength));
                    for (var i = 0; i < rawLength; i++) {
                        array[i] = data.charCodeAt(i);
                    }
                    this.exportFile(array, {type: 'text/csv;charset=' + encoding});
                } else {
                    this.exportFile(data, {type: 'text/csv;charset=' + encoding});
                }
                break;
        }
    }
});
