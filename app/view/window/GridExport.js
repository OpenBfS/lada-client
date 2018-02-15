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
    items: [{
        xtype: 'container',
        name: 'form',
        layout: 'vbox',
        align: 'stretch',
        defaults: {
            displayField: 'name',
            valueField: 'value',
            labelWidth: 200,
            width: 400
        }
    } ,
    {
        xtype: 'container',
        layout: 'hbox',
        defaults: {
            margin: '5,5,5,5'
        },
        items: [{
            xtype: 'button',
            action: 'export',
            text: 'Exportieren'
        },{
            xtype: 'button',
            action: 'close',
            text: 'Schließen'
        }]
    }],

    /**
     * CSV options (separators etc), set by dialogue. TODO: write config here
     */
    csv: {},

    /** the column defining the geometry data for geojson export */
    hasGeojson : null,

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

    // Counter to keep track of asynchronous actions
    totalentries: 0,
    parsedEntries: 0,

    /**
     *Initializ the Window and the options available
     */
    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.callParent(arguments);
        this.title = i18n.getMsg('export.title');
        var columns = this.grid.getColumns();

        // add CSV export options

        this.csv_linesepstore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data : [{
                name: 'Windows',
                value: 'windows'
            },{
                name: 'Linux',
                value: 'linux'
            }]
        });

        this.csv_textlimstore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: '"',
                value: '"'
            }, {
                name: "'",
                value: "'"
            }]
        });

        this.csv_colsepstore =  Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: 'Semikolon',
                value: ';'
            }, {
                name: "Komma",
                value: ","
            },{
                name: 'Leerzeichen',
                value: ' '
            }, {
                name: 'Punkt',
                value: '.'
            }]
        });

        this.csv_decSepStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{
                name: 'Komma',
                value: ','
            },{
                name: 'Punkt',
                value: '.'
            }]
        });

        var columnstore= [];
        var preselected= [];
        for (var i =0; i < columns.length; i++){
            if (columns[i].dataIndex && columns[i].text){
                columnstore.push({
                    value: columns[i].dataIndex,
                    name: columns[i].text
                });
                preselected.push(columns[i].dataIndex);
                if (!columns[i].dataType) {
                    continue;
                }
                switch (columns[i].dataType.name){
                    case 'geom':
                        this.hasGeojson = columns[i];
                        break;
                    case 'messungId':
                        this.hasMessung = columns[i];
                        break;
                    case 'probeId':
                        this.hasProbe = columns[i];
                        break;
                }
            }
        }
        this.columnStore = Ext.create('Ext.data.Store',{
            fields: ['name', 'value'],
            data: columnstore
        });

        //store for additional rowExpander columns
        this.expcolumnStore = Ext.create('Ext.data.Store',{
            fields: ['name', 'value']
        });

        // add export formats

        var formatdata = [
            {name: 'CSV', value: 'csv'},
            {name: 'JSON', value: 'json'}];
        if (this.hasGeojson){
            formatdata.push({
                name: 'geoJSON',
                value: 'geojson'
            });
        }
        if (this.hasProbe || this.hasMessung){
            formatdata.push({
                name: 'LAF-Export',
                value: 'laf'
            });
        }
        this.formatStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: formatdata
        });

        // create comboboxes and checkboxes

        this.down('container[name=form]').add([{
            xtype: 'combobox',
            fieldLabel: i18n.getMsg('export.format'),
            name:'formatselection',
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
            xtype: 'tagfield',
            name: 'exportcolumns',
            labelWidth: 100,
            fieldLabel: i18n.getMsg('export.columns'),
            store: me.columnStore,
            hidden: true,
            value: preselected,
            multiSelect: true
        }, {
            xtype: 'tagfield',
            name: 'exportexpcolumns',
            labelWidth: 100,
            fieldLabel: i18n.getMsg('export.expcolumns'),
            store: me.expcolumnStore,
            hidden: true,
            value: null,
            multiSelect: true
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
                fieldLabel: 'Dezimaltrenner:',
                value: ','
            }]
        }, {
            xtype: 'textfield',
            name: 'filename',
            fieldLabel: i18n.getMsg('export.filename'),
            allowBlank: true,
            editable: true
        }
    ]);

        // listeners
        this.down('button[action=export]').on({
            click: me.doExport
        });
        this.down('button[action=close]').on({
            click: function(button){
                button.up('window').close();
                return;
            }
        });

        // get rowexpander and their columns
        for (var i=0; i < this.grid.plugins.length; i++) {
            if (this.grid.plugins[i].ptype === 'gridrowexpander'){
                this.rowexp = this.grid.plugins[i];
                var nodes = this.rowexp.view.getNodes();
                var node = Ext.fly(nodes[0]);
                if (node.hasCls(this.rowexp.rowCollapsedCls) === true) {
                    this.rowexp.toggleRow(0);
                }
                this.expcolumns  = this.rowexp.cmps.items[0].getColumns();
                var preselectedEx = [];
                for (var i =0; i < this.expcolumns.length; i++){
                    if (this.expcolumns[i].dataIndex && this.expcolumns[i].text){
                        this.expcolumnStore.add({
                            value: this.expcolumns[i].dataIndex,
                            name: this.expcolumns[i].text
                        });
                        preselectedEx.push(this.expcolumns[i].dataIndex);
                    }
                }
                this.down('tagfield[name=exportexpcolumns]').select(preselectedEx);
                break;
            }
        }
    },

    /**
     * Evaluates the options set and starts the corresponding export
     */
    doExport: function(button){
        var win = button.up('window');
        win.exportformat = win.down('combobox[name=formatselection]').getValue();
        var filename = '';
        switch(win.exportformat){
            case 'json':
                var namecheck = win.validateFilename('export.json');
                if (namecheck){
                    win.down('button[action=close]').setDisabled(true);
                    win.exportJson();
                }
                break;
            case 'geojson':
                var namecheck = win.validateFilename('export.geojson')
                if (namecheck){
                    win.down('button[action=close]').setDisabled(true);
                    win.exportGeoJson();
                }
                break;
            case 'csv':
                var namecheck = win.validateFilename('export.csv')
                if (namecheck){
                    win.down('button[action=close]').setDisabled(true);
                    win.exportCSV();
                }
                break;
            case 'laf':
                namecheck = win.validateFilename('export.laf')
                if (namecheck){
                    win.down('button[action=close]').setDisabled(true);
                    win.exportLAF(filename);
                }
                break;
            default:
                win.showError('export.noformat');
        }
    },

    /**
    * Exports the table data as json objects
    */
    exportJson: function(){
        var data = this.getDataSets();
        if (data){
            var columns = this.getColumns();
            var expcolumns = this.getColumns(true);
            if (!columns){
                this.showError('export.nocolumn');
                return false;
            }
            this.resultobject = {};
            for (var i=0; i < data.length; i++ ) {
                var iresult = {};
                for (var col = 0; col < columns.length; col ++ ){
                    var c = columns[col];
                    if (c && data[i].get(c.dataIndex) !== undefined ){
                        var value = this.formatValue(
                            data[i].get(c.dataIndex), c, true);
                        iresult[c.text] = value;
                    }
                }
                var entryId = data[i].get('id');
                this.resultobject[entryId] = iresult;
                if (this.rowexp){
                    this.setSecondaryJson(data[i], 'json', entryId, expcolumns);
                } else {
                    this.countDown();
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
    exportGeoJson: function(){
        var data = this.getDataSets();
        if (data){
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
            for (var i=0; i < data.length; i++){
                var iresult = {
                    type: "Feature",
                    properties: {},
                    geometry : {}
                };
                for (var col = 0; col < columns.length; col ++){
                    var c = columns[col];
                    if (data[i].get(c.dataIndex) !== undefined){
                        if (c.dataType && c.dataType.name === 'geom'){
                            var geodata = data[i].get(c.dataIndex);
                            if (geodata){
                                var realdata = JSON.parse(geodata);
                                iresult.geometry['coordinates'] = realdata.coordinates;
                                iresult.geometry['type'] = realdata.type;
                            }
                        } else {
                            var value = this.formatValue(
                                data[i].get(c.dataIndex), c, true);
                            if (value !== undefined){
                                iresult.properties[c.text] = value;
                            }
                        }
                    }
                }
                resultset.features.push(iresult);
                if (this.rowexp){
                    this.setSecondaryJson(data[i],
                        this.resultobject.features[i].properties, 'geojson', i,
                        expcolumns);
                } else {
                    this.countDown();
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
    exportCSV: function (){
        var data = this.getDataSets();
        if (data){
            var lineseptype = this.down('combobox[name=linesep]').getValue();
            this.csv.linesep = '\r\n';
            if (lineseptype == "linux") {
                this.csv.linesep = '\n';
            }
            this.csv.colsep = this.down('combobox[name=colsep]').getValue();
            this.csv.decsep = this.down('combobox[name=decsep]').getValue();
            this.csv.textsep = this.down('combobox[name=textlim]').getValue();
            // validate csv options
            if (!this.csv.linesep ||
              !this.csv.colsep ||
              !this.csv.decsep){
                this.showError('export.missingvaluescsv');
                return false;
            }
            if (this.csv.colsep === this.csv.decsep){
                this.showError('export.differentcoldecimal');
                return false;
            }
            // create header
            var expcolumns = this.getColumns(true);
            var columns = this.getColumns();
            if (!columns.length && !expcolumns.length){
                this.showError('export.nocolumn');
                return false;
            }
            this.resultobject = this.csv.textsep;
            if (expcolumns.length){
                this.resultobject += expcolumns[0].text + this.csv.textsep;
            } else if (columns.length){
                this.resultobject += columns[0].text + this.csv.textsep;
            }
            for (var col = 1; col < expcolumns.length; col ++){
                this.resultobject += this.csv.colsep + this.csv.textsep +
                    expcolumns[col].text + this.csv.textsep;
            }
            for (var col = 0; col < columns.length; col ++){
                this.resultobject += this.csv.colsep + this.csv.textsep +
                    columns[col].text + this.csv.textsep;
            }
            this.resultobject += this.csv.linesep;

            //iterate through entries
            var me = this;
            for (var entry = 0; entry < data.length; entry++ ){
                var entryline = me.addline(data[entry], columns);
                if (expcolumns.length){
                    me.setSecondaryCsv(data[entry], expcolumns, entryline);
                }
                else {
                    this.resultobject += addline(data[entry], columns)
                        + this.csv.linesep;
                    this.countDown();
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
    exportLAF: function(){
        var dataset = this.getDataSets();
        var jsondata = {};
        if (this.hasMessung){
            jsondata.messungen = [];

            // normally, hasMessung and hasProbe are expected to contain a
            // column with messungId/probeId type. Some grids still don't have
            // that info, so just true is passed and we need to look up the
            // (hard coded) id
            if (this.hasMessung === true){
                for (var i= 0; i < dataset.length; i++) {
                    var mid = dataset[i].get('id');
                    jsondata.messungen.push(mid);
                }
            } else {
                for (var i = 0; i < dataset.length; i++){
                    var mid = dataset[i].get(this.hasMessung.dataIndex);
                    if (Array.isArray(mid)){
                        for (var j=0; j < mid.length; j++){
                            jsondata.messungen.push(mid[j]);
                        }
                    } else {
                        jsondata.messungen.push(mid);
                    }
                };
            }
            if (!jsondata.messungen.length){
                this.showError('export.nodata');
                return false;
            }
        } else if (this.hasProbe) {
            jsondata.proben = [];
            // see comment in messungen above
            if (this.hasProbe === true){
                for (var i= 0; i < dataset.length; i++) {

                    var pid = dataset[i].get('id');
                    jsondata.proben.push(pid);
                }
            } else {
                for (var i= 0; i < dataset.length; i++) {
                    var pid = dataset[i].get(this.hasProbe.dataIndex);
                    jsondata.proben.push(pid);
                }
            }
            if (!jsondata.proben.length){
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
            timeout: 2 * 60 * 1000,
            success: function(response) {
                var content = response.responseText;
                me.exportFile(content);
                return true;
            },
            failure: function(response) {
                /* SSO will send a 302 if the Client is not authenticated
                unfortunately this seems to be filtered by the browser.
                We assume that a 302 was send when the follwing statement
                is true.
                */
                if (response.status == 0 &&
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
    changeFormat: function (box, newValue, oldValue){
        box.up('window').down('fieldset[name=csvoptions]').setVisible(
            newValue === 'csv' ? true: false
        );
        var ecolVisible = true;
        if (box.up('window').down('checkbox[name=allcolumns]').getValue()){
            ecolVisible = false;
        }
        if (newValue === 'laf'){
            ecolVisible = false;
        }
        box.up('window').down('tagfield[name=exportcolumns]').setVisible(
            ecolVisible);
    },

    exportalltoggle: function(box, newValue, oldValue){
        var me = box.up('window');
        me.down('tagfield[name=exportcolumns]').setVisible(
            !newValue);
        if (me.rowexp){
            me.down('tagfield[name=exportexpcolumns]').setVisible(!newValue);
        }
    },

    /**
     * Saves the resulting data
     */
    exportFile: function (data){
        var blob = new Blob([data]);
        saveAs(blob, this.filename);
        this.close();
    },

    /**
     * Prepares the data selected
     */
    getDataSets: function(){
        var dataset = this.grid.getSelectionModel().getSelection();
        if (!dataset.length){
            this.showError('export.nodata');
            this.close();
        }
        this.totalentries = dataset.length;
        return dataset;
    },

    getColumns: function(sec){
        var allcolumns = this.down('checkbox[name=allcolumns]').getValue();
        var columnlist = [];
        var cols = [];
        if (sec){
            cols = this.expcolumns;
        } else {
            cols = this.grid.getColumns();
        }
        var exportcols = null;
        if (sec){
            exportcols = this.down('tagfield[name=exportexpcolumns]').getValue();
        } else {
            exportcols = this.down('tagfield[name=exportcolumns]').getValue();
        }
        for (var i=0; i < cols.length; i ++){
            if (!cols[i].dataIndex){
                continue;
            }
            if (allcolumns || exportcols.indexOf(cols[i].dataIndex) > -1){
                columnlist.push(cols[i]);
            }
        }
        return columnlist;
    },

    showError: function(message){
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var text = '';
        if (!message){
            text = i18n.getMsg('export.failednoreason');
        } else {
            text = i18n.getMsg(message);
        }
        Ext.create('Ext.window.Window', {
            title : i18n.getMsg('export.failed'),
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
    formatValue: function(value, column, json){
        if (!column || value === undefined || value === null ) {
            return null;
        }
        if (!column.dataType){
            return value;
        }
        switch (column.dataType.name) {
            case 'number':
                if (!value && value !== 0){
                    return null;
                }
                if (value.indexOf('<') === 0){
                    // TODO better handling of '<'. it really is a 0 with
                    // additional info, but it is a string, not a number
                    return value;
                }
                return Number.parseFloat(value);
            case 'date':
                if (column.dataType.format && !json){
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
     * Validation of filename input. Returns the valid filename, the defaultname
     * if textfield is empty or "false" if the text is invalid
     */
    validateFilename: function(defaultname){
        var defname = defaultname || 'export.txt';
        var fname = this.down('textfield[name=filename]').getValue();
        if (fname) {
            //TODO better regex: this is quite basic
            var pattern =
                new RegExp(/^(\w|[äöüß])+(\w|\.|\s|[äüöß])*[^\W\.]$/i);
            if (!pattern.test(fname)){
                this.showError('export.invalidfilename');
                return false;
            } else {
                this.filename = fname;
                return true;
            }
        } else {
            this.filename = defname;
            return true;
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
    setSecondaryJson: function(entry, type, idx, columns){
        if (!this.rowexp){
            this.parsedEntries +=1;
            return;
        }
        var me = this;
        var fillData = function(content){
            var results = [];
            Object.keys(content).forEach(function(key,index) {
                var result = {};
                for (var i=0; i< columns.length; i++){
                    var di = columns[i].dataIndex;
                    if (di){
                        result[di] = content[key][di];
                    }
                }
                results.push(result);
            });
            return results;
        };
        switch (this.rowexp.type){
            case 'Lada.view.grid.Messung':
                Ext.Ajax.request({
                    url: 'lada-server/rest/messung?probeId=' + idx,
                    timeout: 5 * 1000,
                    success: function(response) {
                        var content = JSON.parse(response.responseText);
                        if (type === 'json'){
                            me.resultobject[idx].Messungen =
                                fillData(content.data);
                        } else if (type === 'geojson'){
                            me.resultobject.features[idx].Messungen =
                                fillData(content.data);
                        }
                        me.countDown();
                    },
                    failure: function(){
                        //TODO error handling.
                        me.countDown();
                        return null;
                    }
                })
                break;
            case 'Lada.view.grid.Messwert':
                Ext.Ajax.request({
                    url: 'lada-server/rest/messwert?messungId=' + id,
                    timeout: 5 * 1000,
                    success: function(response) {
                        var content = JSON.parse(response.responseText);
                        if (type === 'json'){
                            me.resultobject[idx].Messwerte =
                                fillData(content.data);
                        } else if (type === 'geojson'){
                            me.resultobject.features[idx].Messwerte =
                                fillData(content.data);
                        }
                        me.countDown();
                    },
                    failure: function(){
                        //TODO error handling.
                        me.countDown();
                        return null;
                    }
                })
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
    setSecondaryCsv: function (item, columns, primaryRow){
        var me = this;
        if (!this.rowexp){
            this.parsedEntries +=1;
            return;
        }
        var id = item.get('id');
        switch (this.rowexp.type){
            case 'Lada.view.grid.Messung':
                Ext.Ajax.request({
                    url: 'lada-server/rest/messung?probeId=' + id,
                    timeout: 5 * 1000,
                    success: function(response) {
                        var content = JSON.parse(response.responseText);
                        var line = '';
                        Object.keys(content.data).forEach(function(key,index) {
                            line += me.addline(content.data[key], columns)
                                + primaryRow
                                + me.csv.linesep;
                        });
                        me.resultobject += line;

                        me.countDown();
                    },
                    failure: function(){
                        me.countDown();
                        //TODO error handling.
                        return null;
                    }
                })
                break;
            case 'Lada.view.grid.Messwert':
                Ext.Ajax.request({
                    url: 'lada-server/rest/messwert?messungId=' + id,
                    timeout: 5 * 1000,
                    success: function(response) {
                        var content = JSON.parse(response.responseText);
                        var line = '';
                        Object.keys(content.data).forEach(function(key,index) {
                            line += me.addline(content.data[key], columns)
                                + primaryRow
                                + me.csv.linesep;
                        });
                        me.resultobject += line;
                        me.countDown();
                    },
                    failure: function(){
                        //TODO error handling.
                        me.countDown();
                        return null;
                    }
                })
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
    addline: function(record, columns){
        var line = '';
        for (var col = 0; col < columns.length; col++ ) {
            var newvalue = null;
            if (record.get){
                newvalue =  record.get(columns[col].dataIndex);
            } else { // not an extJS model, but a direct json object
                newvalue =  record[columns[col].dataIndex];
            }
            line += col > 0 ? this.csv.colsep: '';
            var value = this.formatValue(newvalue, columns[col], false);
            switch( typeof(value) ){
                case 'number':
                    value = value.toString();
                    if (this.csv.decsep === ',' && value.indexOf(".") > -1){
                    value.replace(/'.'/g, ',');
                    }
                    line += value;
                    break;
                case 'undefined': //leave column empty
                    break;
                case 'object': //leave column empty
                    break;
                case 'string':
                    if (value.indexOf(this.textsep) > -1 ){
                        // This will alter the data exported
                        // (exchanging single/double quotes)
                        var i18n = Lada.getApplication().bundle;

                        var oldChar;
                        var newChar;
                        if (textsep ===  '"'){
                            value.replace(/\"/g, "'");
                            oldChar = '"';
                            newChar = "'";
                        } else {
                            oldChar= "'";
                            newChar = '"';
                            value.replace(/\'"'/g, '"');
                        }
                        if (!this.csv_asked){
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
                                    text: 'OK',
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
                        val = this.csv.textsep + value.toIsoString() +
                        this.csv.textsep;
                    }
                    catch(err){
                        val = ''
                    }
                    line += val;
                    break;
                case 'boolean': // convert into 1 and 0
                    if (value){
                        line += '1';
                    } else{
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
    countDown: function(){
        this.parsedEntries += 1;
        if (this.parsedEntries < this.totalentries){
            return;
        }
        switch (this.exportformat){
            case 'json':
                this.exportFile(JSON.stringify(this.resultobject));
                break;
            case 'geojson':
                this.exportFile(JSON.stringify(this.resultobject));
                break;
            case 'csv':
                this.exportFile(this.resultobject);
                break;
        }
    }
});
