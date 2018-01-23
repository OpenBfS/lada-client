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
Ext.define('Lada.view.window.DataExport', {

    // app/controller/Filterresult: Export LAF
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

    hasGeojson : false,
    hasProbe: false,
    hasMessung: false,

    /**
     * This function initialises the Window and the options available
     */
    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.callParent(arguments);
        this.title = i18n.getMsg('export.title');
        var columns = this.grid.getColumns();
        // CSV export options
        this.csv_linesepstore = Ext.create('Ext.data.Store', {
            model: Ext.create('Ext.data.Model', {
                fields: ['name', 'value'],
                data : [{
                    name: 'Windows',
                    value: 'windows'
                },{
                    name: 'Linux',
                    value: 'linux'
                }]
            }),
            autoLoad: true
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
            columnstore.push({
                value: columns[i].dataIndex,
                name: columns[i].text
            });
            preselected.push(columns[i].dataIndex);
            if (!columns[i].dataType) {
                continue;
            }
            switch (columns[i].dataType.name){
                // case 'geom':                 //TODO: not ready yet
                //     this.hasGeojson = true;
                //     break;
                case 'messungId':
                    this.hasMessung = columns[i];
                    break;
                case 'probeId':
                    this.hasProbe = columns[i];
                    break;
            }
        }
        this.columnStore = Ext.create('Ext.data.Store',{
            fields: ['name', 'value'],
            data: columnstore
        });

        // Export formats
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

        if(!this.grid || !this.grid.store.getCount()){
            this.showError('export.nodata');
            this.close();
        }
        // if rows are selected, assume that only marked are to be exported
        if (this.grid.getSelectionModel().getSelection().length){
            this.down('checkbox[name=selection]').setVisible(true);
            this.down('checkbox[name=selection]').setValue(true);
        }
        this.down('button[action=export]').on({
            click: me.doExport
        });
        this.down('button[action=close]').on({
            click: function(button){
                button.up('window').close();
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
            if (!columns.length){
                return false;
            }
            var resultset = {};
            for (var i=0; i < data.length; i++ ) {
                var iresult = {};
                for (var col = 0; col < columns.length; col ++ ){
                    if (columns[col]
                      && data[i].get(columns[col]) !== undefined ){
                        iresult[columns[col]] = data[i].get(columns[col]);
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
    exportGeoJson: function(){ //TODO not ready yet, stub!
        var data = this.getDataSets();
        if (data){
            var columns = this.getColumns();
            var resultset = {
                type: 'FeatureCollection',
                features: [],
                crs: null // TODO
                // type: "name",
                //     "properties": {
                //       "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            };
            for (var i=0; i < data.length; i++){
                var iresult = {
                    properties: null,
                    geometry : null};

                for (var col = 0; col < columns.length; col ++){
                    if (data[i].get(columns[col]) !== undefined){
                        iresult.properties[columns[col]] = data[i].get(
                            columns[col]);
                        if (columns[col].dataType.name === 'geom'){
                            var gjson = data[i].get(
                                columns[col]).data.geometry;
                            iresult.geometry.coordinates = gjson.coordinates;
                            iresult.geometry.type = gjson.type;
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

            //first column doesn't start with a column separator
            var resulttable = [columns[0]];
            for (var col = 1; col < columns.length; col ++){
                resulttable += colsep + columns[col];
            }
            resulttable += linesep;

            //iterate through entries
            var me = this;
            var addline = function(record, secondaryInfo){
                //TODO: use secondaryInfo
                //TODO: use data from rowExpander
                var line = '';
                for (var col = 0; col < columns.length; col++ ) {
                    var newvalue =  record.get(columns[col]);
                    line += col > 0 ? colsep: '';
                    switch( typeof(newvalue) ){
                        //TODO: should not only check newvalue, but type of column,
                        case 'number':
                            newvalue = newvalue.toString();
                            if (decsep === ',' && newvalue.indexOf(".") > -1){
                            newvalue.replace(/'.'/g, ',');
                            }
                            line += newvalue;
                            break;
                        //case datetime TODO!
                        case 'undefined': //leave column empty
                            break;
                        case 'object': //leave column empty
                            break;
                        case 'string':
                            if (newvalue && newvalue.indexOf(textsep) > -1 ){
                                if (!me.csv_asked){
                                    // ask! TODO return with error if "no:"
                                    me.csv_asked = true;
                                }
                                if (textsep ===  '"'){
                                    newvalue.replace(/\"/g, "'");
                                } else {
                                    newvalue.replace(/\'"'/g, '"');
                                }
                            }
                            line += textsep + newvalue + textsep;
                            break;
                        case 'boolean':
                            if (newvalue){
                                line += '1';
                            } else{
                                line += '0';
                            }
                            break;
                        default:
                            console.log('Fehler: Kein Exportformat für ' +
                                typeof(newvalue) + ' definiert.');
                    }
                }
                line += linesep;
                return line;
            };
            // TODO: if grouping different (i.e. one line per messung:
            // secondaryInfo{sortitem: index: extraColumns: }
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
            for (var i = 0; i < dataset.length; i++){
                // TODO: what about proben without messungen in this case?
                var mid = dataset[i].get(this.hasMessung.dataIndex);
                if (Array.isArray(mid)){
                    for (var j=0; j < mid.length; j++){
                        jsondata.messungen.push(mid[j]);
                    }
                } else {
                    jsondata.messungen.push(mid);
                }
            };
            if (!jsondata.messungen.length){
                this.showError('export.nodata');
                return false;
            }
        } else if (this.hasProbe) {
            jsondata.proben = [];
            if (this.hasProbe === true){
                // temporary: we may not have a column containing the probeId
                // (old probengrid)
                for (var i= 0; i < dataset.length; i++) {
                    var pid = dataset[i].get('pid');
                    if (!pid && pid !== 0){
                        pid = dataset[i].get('probeId');
                    }
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
            this.showError(); //TODO: "wrong format"
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
        var rawcolumns = this.down('tagfield[name=exportcolumns]').getValue();
        var columns = [];
        // avoid local columns without dataIndex
        for (var col = 0; col < rawcolumns.length; col ++) {
            if (rawcolumns[col]){
                columns.push(rawcolumns[col]);
            }
        }
        if (!columns.length){
            this.showError('export.nocolumn');
            //TODO: error handling: Do not continue execution
        }
        return columns;
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
    }

});