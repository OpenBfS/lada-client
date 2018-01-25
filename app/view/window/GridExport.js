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
    grid: null,
    items: [{
        xtype: 'container',
        name: 'form',
        layout: 'vbox',
        defaults: {
            displayField: 'name',
            valueField: 'value',
            labelWidth: 125,
            maxWidth: 300,
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

    /** the column defining the geometry data for geojson export */
    hasGeojson : null,

    /** the column defining the probeId for LAF export, or true if grid
     * * consists of Proben without having a probeId result_type column */
     hasProbe: null,

    /** the column defining the messungId for LAF export, or true if grid
* consists of Messungen without having a messungId result_type column */
    hasMessung: null,

    /**
     * This function initialises the Window and the options available
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
                        this.hasGeojson = true;
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

        // add export formats

        var formatdata = [
            {name: 'CSV', value: 'csv'},
            {name: 'JSON', value: 'json'}];
        if (this.geojson){
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
            xtype: 'checkbox',
            name: 'selection',
            fieldLabel: i18n.getMsg('export.selected'),
            checked: false
        }, {
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
        }, {
            xtype: 'tagfield',
            name: 'exportcolumns',
            fieldLabel: i18n.getMsg('export.columns'),
            store: me.columnStore,
            value: preselected,
            multiSelect: true
        }, {
            xtype: 'filefield',
            fieldLabel: i18n.getMsg('export.filename'),
            allowBlank: false
        }, {
            xtype: 'fieldset',
            title: i18n.getMsg('export.csvdetails'),
            collapsible: true,
            collapsed: true,
            name: 'csvoptions',
            visible: false,
            margins: '5,5,5,5',
            defaults: {
                displayField: 'name',
                valueField: 'value',
                labelWidth: 120,
                maxWidth: 270
                //TODO: layout and margins
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
        }]);

        // if rows are selected, preselect option to only export marked entries
        var sel = false;
        if (this.grid.getSelectionModel().getSelection().length){
            sel = true;
        }
        this.down('checkbox[name=selection]').setVisible(sel);
        this.down('checkbox[name=selection]').setValue(sel);

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
    },

    /**
     * Evaluates the options set and starts the corresponding export
     */
    doExport: function(button){
        var win = button.up('window');
        var format = win.down('combobox[name=formatselection]').getValue();
        var actionresult = false;
        switch(format){
            case 'json':
                actionresult = win.exportJson();
                break;
            case 'geojson':
                actionresult = win.exportGeoJson();
                break;
            case 'csv':
                actionresult = win.exportCSV();
                break;
            case 'laf':
                actionresult = win.exportLAF();
                break;
            default:
                win.showError('export.noformat');
        }
        if (actionresult){
            win.close();
        }
    },

    /**
    * Exports the table data as json objects
    */
    exportJson: function(){
        var data = this.getDataSets();
        if (data){
            var columns = this.getColumns();
            if (!columns){
                return false;
            }
            var resultset = {};
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
                resultset[i] = iresult;
            }
            this.exportFile(JSON.stringify(resultset), 'export.json');
            return true;
        } else {
            this.showError('export.nodata');
            return false;
        }
    },

    /**
     * Exports the geometry as geojson points with the table data as properties
     */
    exportGeoJson: function(){ //TODO not tested yet!
        var data = this.getDataSets();
        if (data){
            var columns = this.getColumns();
            if (!columns) {
                return false;
            }
            var resultset = {
                type: 'FeatureCollection',
                features: []
            };
            for (var i=0; i < data.length; i++){
                var iresult = {
                    properties: null,
                    geometry : null};

                for (var col = 0; col < columns.length; col ++){
                    var c = columns[col];
                    if (data[i].get(c.dataIndex) !== undefined){
                        if (c.dataType && c.dataType.name === 'geom'){
                            var data = data[i].get(c.dataIndex);
                            var gjs = null;
                            if (data){
                                gjs = data.data.geometry;
                                iresult.geometry.coordinates = gjs.coordinates;
                                iresult.geometry.type = gjs.type;
                            }
                        } else {
                            var value = this.formatValue(
                                data[i].get(c.dataIndex), c, true);
                            iresult.properties[c.text] = value;
                        }
                    }
                }
                resultset.features.push(iresult);
            }
            this.exportFile(JSON.stringify(resultset), 'export.geojson');
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
            var linesep = '\r\n';
            if (lineseptype == "linux") {
                linesep = '\n';
            }
            var colsep = this.down('combobox[name=colsep]').getValue();
            var decsep = this.down('combobox[name=decsep]').getValue();
            var textsep = this.down('combobox[name=textlim]').getValue();
            // validate csv options
            if (!linesep || !colsep || !decsep){
                this.showError('export.missingvaluescsv');
                return false;
            }
            if (colsep === decsep){
                this.showError('export.differentcoldecimal');
                return false;
            }

            // create header
            var columns = this.getColumns();
            if (!columns) {
                return false;
            }

            //first column doesn't start with a column separator
            var resulttable = textsep + columns[0].text + textsep;
            for (var col = 1; col < columns.length; col ++){
                resulttable += colsep + textsep + columns[col].text + textsep;
            }
            resulttable += linesep;

            //iterate through entries
            var me = this;
            var addline = function(record, secondaryInfo){
                //TODO: use data from rowExpander
                var line = '';
                for (var col = 0; col < columns.length; col++ ) {
                    var newvalue =  record.get(columns[col].dataIndex);
                    line += col > 0 ? colsep: '';
                    var value = me.formatValue(newvalue, columns[col], false);
                    switch( typeof(value) ){
                        case 'number':
                            value = value.toString();
                            if (decsep === ',' && value.indexOf(".") > -1){
                            value.replace(/'.'/g, ',');
                            }
                            line += value;
                            break;
                        case 'undefined': //leave column empty
                            break;
                        case 'object': //leave column empty
                            break;
                        case 'string':
                            if (value.indexOf(textsep) > -1 ){
                                // TODO: By default, this will alter the data
                                // exported (exchanging single/double quotes)
                                // user should be warned that this is necessary
                                if (!me.csv_asked){
                                    //TODO abort export if user doesn't want it
                                    me.csv_asked = true;
                                }
                                if (textsep ===  '"'){
                                    value.replace(/\"/g, "'");
                                } else {
                                    value.replace(/\'"'/g, '"');
                                }
                            }
                            line += textsep + value + textsep;
                            break;
                        case 'object':
                        // may be an unformatted date. Try
                        // converting it into a string.
                            var val = '';
                            try {
                                val = textsep + value.toIsoString() + textsep;
                            }
                            catch(err){
                                val = ''
                            }
                            line += val;
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
                line += linesep;
                return line;
            };
            // TODO: if grouping is different (i.e. one line per row of
            // rowexpander, next loop needs to be expanded
            for (var entry = 0; entry < data.length; entry++){
                resulttable += addline(data[entry]);
            }
            me.exportFile(resulttable, 'export.csv');
            return true;
        } else {
            this.showError('export.nodata');
            return false;
        }

    },

    /**
     * Exports as probe-LAF, or, if available, as messung-LAF
     */
    exportLAF: function(records){
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
            this.showError('wrongformat'); //TODO: "wrong format"
            return false;
        }
        var me = this;
        Ext.Ajax.request({
            url: 'lada-server/data/export/laf',
            jsonData: jsondata,
            timeout: 2 * 60 * 1000,
            success: function(response) {
                var content = response.responseText;
                me.exportFile(content, 'export.laf')
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
        box.up('window').down('tagfield[name=exportcolumns]').setVisible(
            newValue === 'laf' ? false: true
        )
    },

    /**
     * Saves the resulting data to the optional filename specified in the
     * widget, or if not given, to a filename specified as default
     */
    exportFile: function (data, defaultname){
        this.filename = this.down('filefield').getValue() || defaultname;
        var blob = new Blob([data]);
        //TODO (optional) validation of filename
        saveAs(blob, this.filename);
    },

    /**
     * Prepares the data selected
     */
    getDataSets: function(){
        var dataset = [];
        if (this.down('checkbox[name=selection]').getValue()){
            dataset = this.grid.getSelectionModel().getSelection();
        } else {
            dataset = this.grid.store.getData().items;
        }
        if (!dataset.length){
            this.showError('export.nodata');
        }
        return dataset;
    },

    getColumns: function(){
        var allcolumns = this.down('checkbox[name=allcolumns]').getValue();
        var columnlist = [];
        var cols = this.grid.getColumns();
        var exportcols = this.down('tagfield[name=exportcolumns]').getValue();
        for (var i=0; i < cols.length; i ++){
            if (!cols[i].dataIndex){
                continue;
            }
            if (allcolumns || exportcols.indexOf(cols[i].dataIndex) > -1){
                columnlist.push(cols[i]);
            }
        }
        if (!columnlist.length){
            this.showError('export.nocolumn');
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
        }
});