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

    defaults: {
        margin: '5, 5, 5, 5',
        border: false
    },

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


    /**
     * internal storage for fetched secondaty data
     */
    secondaryData: [],

    lafRequestUrl: '/laf',

    /**
     *Initialize the Window and the options available
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
                checked: this.grid.exportRowexp ? true: false,
                listeners: {
                    change: me.exportsecondarytoggle
                },
                hidden: true
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
            }, {
                xtype: 'button',
                action: 'copyGeoJson',
                icon: 'resources/img/map_add.png',
                iconAlign: 'left',
                text: i18n.getMsg('export.button.copy'),
                hidden: true
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
        this.down('button[action=copyGeoJson]').on({
            click: me.doCopy
        });

        // get rowexpander and their columns
        var toggled = false;
        if (!this.grid.plugins) {
            return;
        }
        var preselectedEx = [];
        for (var j=0; j < this.grid.plugins.length; j++) {
            if (this.grid.plugins[j].ptype === 'gridrowexpander') {
                this.down('checkbox[name=secondarycolumns]').setHidden(false);
                this.rowexp = this.grid.plugins[j];
                this.secondaryDataIsPrefetched = false;
                this.getSecondaryData();
                var nodes = this.rowexp.view.getNodes();
                var node = Ext.fly(nodes[0]);
                if (node.hasCls(this.rowexp.rowCollapsedCls) === true) {
                    this.rowexp.toggleRow(0);
                    toggled = true;
                }
                this.expcolumns = this.rowexp.cmps.items[0].getColumns();
                for (var col =0; col < this.expcolumns.length; col++) {
                    if (this.expcolumns[col].dataIndex &&
                      this.expcolumns[col].dataIndex !== 'readonly') {

                        this.expcolumnList.add({
                            value: this.expcolumns[col].dataIndex,
                            name: this.expcolumns[col].text || this.expcolumns[i].dataIndex
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

        this.down('button[action=export]').text= i18n.getMsg('export.button');
        this.down('tagfield[name=exportexpcolumns]').select(preselectedEx);
        // Set this value because most systems work still with 'ISO-8859-15'
        this.down('combobox[name=encoding]').setValue('iso-8859-15');
    },

    doCopy: function(button) {
        var i18n = Lada.getApplication().bundle;
        button.setDisabled(true);
        button.setText(i18n.getMsg('export.button.loading'));
        var me = button.up('window');
        var prefetchCallBack = function() {
            var data = JSON.stringify(me.getGeoJson());
            window.localStorage.setItem('gis-transfer-data', data);
            window.localStorage.setItem('gis-transfer-data-transfer-date', new Date().valueOf());
            button.setText(i18n.getMsg('export.button.copy.success'));
        };
        if (me.down('checkbox[name=secondarycolumns]').getValue() && !me.secondaryDataIsPrefetched) {
            me.secondaryDataIsPrefetching.then(
                prefetchCallBack,
                function(error) {
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
     */
    getSecondaryData: function() {
        this.secondaryDataIsPrefetched = false;
        var data = this.getDataSets();
        var prm = [];
        var di = this.grid.rowtarget.dataIndex;
        for (var i = 0; i< data.length; i++) {
            var urlString = '';
            switch (this.rowexp.type) {
                case 'Lada.view.grid.Messung':
                    urlString = 'messung?probeId=' + data[i].get(di);
                    break;
                case 'Lada.view.grid.Messwert':
                    urlString = 'messwert?messungsId=' + data[i].get(di);
                    break;
            }
            if (urlString) {
                prm.push(
                    new Ext.Promise(function(resolve, reject) {
                        Ext.Ajax.request({
                            url: 'lada-server/rest/'+ urlString,
                            timeout: 30 * 1000,
                            success: function(response) {
                                resolve(JSON.parse(response.responseText).data);
                            },
                            failure: function() {
                                reject('export.datatimeout');
                            }
                        });
                    })
                );
            }
        }
        var me = this;
        this.secondaryDataIsPrefetching = new Ext.Promise(function(resolve, reject) {
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
        var exportFormat = win.down('combobox[name=formatselection]').getValue();
        if (!exportFormat) {
            win.showError('export.noformat');
            return;
        }
        var filename = win.validateFilename(exportFormat);
        if (!filename) {
            win.showError('export.invalidfilename');
            return;
        }
        var content = '';
        var encoding = win.down('combobox[name=encoding]').getValue();
        var textType = '';
        var prefetchCallBack = function() {
            switch (exportFormat) {
                case 'geojson':
                    content = JSON.stringify(win.getGeoJson());
                    textType = 'application/json';
                    break;
                case 'json':
                    content = JSON.stringify(win.getJson());
                    textType = 'application/json';
                    break;
                case 'csv':
                    content = win.getCSV(encoding);
                    textType = 'text/csv';
                    break;
                case 'laf':
                    win.getLAF(encoding, filename);
                    break;
            }
            if (content) {
                win.exportFile(content, {
                    type: textType + ';charset=' + encoding}, filename);
            }
        };
        if (win.down('checkbox[name=secondarycolumns]').getValue()) {
            button.setText(Lada.getApplication().bundle.getMsg(
                'export.button.loading'));
            button.setDisabled(true);
            win.secondaryDataIsPrefetching.then(
                prefetchCallBack,
                function(error) {
                    win.showError('export.preloadfailed');

                }
            );
        } else {
            prefetchCallBack();
        }
    },

    /**
    * fetches the data as json object
    */
    getJson: function() {
        var data = this.getDataSets();
        if (data) {
            var columns = this.getColumns();
            var expcolumns = this.getColumns(true);
            if (!columns) {
                this.showError('export.nocolumn');
                return false;
            }
            var resultobject = {};
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
                if (this.rowexp && this.down('checkbox[name=secondarycolumns]').getValue()) {
                    var secondaryData = this.setSecondaryJson(entryId, expcolumns);
                    if (this.rowexp.type === 'Lada.view.grid.Messung') {
                        iresult.Messungen = secondaryData;
                    } else if (this.rowexp.type === 'Lada.view.grid.Messwert') {
                        iresult.Messwerte = secondaryData;
                    }
                }
                resultobject[entryId] = iresult;
            }
            return resultobject;
        }
    },

    /**
     * Fetches the data as geojson points with the row's data as properties
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
        for (var row=0; row < data.length; row++) {
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
                            iresult.geometry['coordinates'] = realdata.coordinates;
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
            if (this.rowexp && this.down('checkbox[name=secondarycolumns]').getValue()) {
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
     * retrieve the table data as csv, with header.
     */
    getCSV: function(encoding) {
        // TODO: should not be called  unless secondaryData has returned
        var data = this.getDataSets();
        var me = this;
        var resultobject = '';
        if (data) {
            var lineseptype = me.down('combobox[name=linesep]').getValue();
            me.csv.linesep = '\r\n';
            if (lineseptype === 'linux') {
                me.csv.linesep = '\n';
            }
            me.csv.colsep = me.down('combobox[name=colsep]').getValue();
            me.csv.decsep = me.down('combobox[name=decsep]').getValue();
            me.csv.textsep = me.down('combobox[name=textlim]').getValue();
            // validate csv options
            if (!me.csv.linesep ||
              !me.csv.colsep ||
              !me.csv.decsep) {
                me.showError('export.missingvaluescsv');
                return false;
            }
            if (me.csv.colsep === me.csv.decsep) {
                me.showError('export.differentcoldecimal');
                return false;
            }
            // create header
            var expcolumns = [];
            if ( me.down('checkbox[name=secondarycolumns]').getValue()) {
                expcolumns = me.getColumns(true);
            }
            var columns = me.getColumns();
            if (!columns.length && !expcolumns.length) {
                me.showError('export.nocolumn');
                return false;
            }
            resultobject = me.csv.textsep;

            if (columns.length) {
                resultobject += columns[0].text + me.csv.textsep;
            } else if (expcolumns.length) {
                resultobject += expcolumns[0].text + me.csv.textsep;
            }
            for (var col = 1; col < columns.length; col ++) {
                resultobject += me.csv.colsep + me.csv.textsep +
                    columns[col].text + me.csv.textsep;
            }
            var col_i = 0;
            if (!columns.length && expcolumns.length) {
                col_i = 1;
            }
            for (col_i; col_i < expcolumns.length; col_i ++) {
                resultobject += me.csv.colsep + me.csv.textsep +
                    expcolumns[col_i].text + me.csv.textsep;
            }
            resultobject += me.csv.linesep;

            //iterate through entries
            for (var entry = 0; entry < data.length; entry++ ) {
                var entryline = me.addline(data[entry], columns);
                if (expcolumns.length) {
                    resultobject += me.getSecondaryCsv(
                        data[entry], expcolumns, entryline, encoding);
                } else {
                    resultobject += entryline + me.csv.linesep;
                }
            }
            return resultobject;
        } else {
            me.showError('export.nodata');
            return false;
        }
    },

    /**
     * fetches probe-LAF, or, if available, messung-LAF
     */
    getLAF: function(encoding, filename) {
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
            for (var k= 0; k < dataset.length; k++) {
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
        var me = this;
        var printController = Lada.app.getController('Lada.controller.Print');
        var queueItem = printController.addQueueItem(filename, 'laf');
        Ext.Ajax.request({
            url: me.lafRequestUrl,
            jsonData: jsondata,
            headers: {
                'X-FILE-ENCODING': encoding
            },
            success: function(response) {
                var json = Ext.decode(response.responseText);
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
            },
            failure: function(response) {
                queueItem.set('done', true);
                queueItem.set('status', 'error');
                /* SSO will send a 302 if the Client is not authenticated
                unfortunately this seems to be filtered by the browser.
                We assume that a 302 was send when the follwing statement
                is true.
                */
                if (response.status === 0 &&
                response.getResponse().responseText === '') {
                    var i18n = Lada.getApplication().bundle;
                    Ext.MessageBox.confirm(i18n.getMsg('err.msg.sso.expired.title'),
                        i18n.getMsg('err.msg.sso.expired.body'), me.reload);
                }
            }
        });
    },

    /**
     * change the GUI as another export format is selected
     */
    changeFormat: function(box, newValue) {
        var win = box.up('window');
        win.down('fieldset[name=csvoptions]').setVisible(
            newValue === 'csv' ? true: false
        );
        win.resetCopyButton(win);
        if (newValue === 'geojson') {
            win.down('button[action=copyGeoJson]').setVisible(true);
            win.down('button[action=copyGeoJson]').setText(
                Lada.getApplication().bundle.getMsg('export.button.copy'));
        } else {
            win.down('button[action=copyGeoJson]').setVisible(false);
        }
        win.down('combobox[name=encoding]').setVisible(
            newValue === 'csv' || newValue === 'laf' ? true: false
        );
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
            if (this.rowexp) {
                win.down('checkbox[name=secondarycolumns]').setVisible(true);
            }
        }
        win.down('tagfield[name=exportcolumns]').setVisible(ecolVisible);
    },

    exportalltoggle: function(box, newValue) {
        var me = box.up('window');
        me.down('tagfield[name=exportcolumns]').setVisible(
            !newValue);
        if (me.rowexp && me.down('checkbox[name=secondarycolumns]').getValue()) {
            me.down('tagfield[name=exportexpcolumns]').setVisible(!newValue);
        }
        me.resetCopyButton(me);
    },

    exportsecondarytoggle: function(box, newValue) {
        var me = box.up('window');
        var expButton = me.down('button[action=export]');
        if (newValue) {
            me.down('tagfield[name=exportexpcolumns]').setVisible(
                !me.down('checkbox[name=allcolumns]').getValue()
            );
        } else {
            me.down('tagfield[name=exportexpcolumns]').setVisible(false);
        }
        expButton.setText(
            Lada.getApplication().bundle.getMsg('export.button'));
        expButton.setDisabled(false);
        me.resetCopyButton(me);
    },


    /**
     * Saves the resulting data
     */
    exportFile: function(data, encoding, filename) {
        if (filename.split('.').pop() === 'csv') {
            var blob = new Blob(["\uFEFF",data], encoding);
        } else {
            var blob = new Blob([data], encoding);
        }
        saveAs(blob, filename, true);
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
        var title = i18n.getMsg('export.failed');
        if (!message) {
            text = i18n.getMsg('export.failednoreason');
        } else {
            text = i18n.getMsg(message);
        }

        var window = Ext.ComponentQuery.query('window[title='+ title+ ']');
        if (window.length) {
            return;
        }
        Ext.create('Ext.window.Window', {
            title: title,
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
            if (column.dataIndex === 'messgroesseId') {
                console.log(column.dataIndex);
                var store = Ext.data.StoreManager.get('messgroessen');
                var record = store.getById(value);
                if (record) {
                    var r = record.get('messgroesse');
                    return r || '';
                }
                return '';
            }
            if (column.dataIndex === 'mehId') {
                var store = Ext.data.StoreManager.get('messeinheiten');
                var record = store.getById(value);
                if (record) {
                    var r = record.get('einheit');
                    return r || '';
                }
                return '';
            }
            if (column.dataIndex === 'statusKombi') {
                var store = Ext.data.StoreManager.get('statuskombi');
                var record = store.getById(value);
                if (record) {
                    var r = record.data.statusStufe.stufe + ' ' + record.data.statusWert.wert;
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
                break;
            case 'date':
                if (column.dataType.format && !json) {
                    return Lada.util.Date.formatTimestamp(
                        value, column.dataType.format, true
                    );
                } else {
                    return new Date(value);
                }
                break;
            case 'geom':
                return value;
                break;
            case 'text':
                return value;
                break;
            case 'probeId':
            case 'messungId':
            case 'ortId':
                return value;
                break;
            case 'statuskombi':
                var store = Ext.data.StoreManager.get('statuskombi');
                     var record = store.getById(value);
                     if (record) {
                         var r = record.data.statusStufe.stufe + ' ' + record.data.statusWert.wert;
                         return r || '';
                     }
                     return '';
                break;
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
            if (fname.length > defaultend.length && // fname may be shorter than ending
                fname.toLowerCase().indexOf(defaultend.toLowerCase()) ===
                    fname.length - defaultend.length) {
                return fname;
            } else {
                return fname + '.' + defaultend;

            }
        }
    },

    /**
     * Adds the rowExpander data by sending an AJAX request; the resultobject
     * will be ammended asynchronously after an answer is received.
     * @param {*} parentId Number/String to find the original record entry in the
     * resultobject
     * @param {*} columns Columns to be included
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
    for (var j=0; j< secondaryData.length; j++) {
        var item = {};
        Object.keys(secondaryData[j]).forEach(function(key) {
            for (var i=0; i< columns.length; i++) {
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

    /**
     * adds one csv line per subentry in the rowexpander.
     * @param item the original item of the grid
     * @param columns the columns to be added
     * @param primaryRow The prepared part of the csv which adds (redundant)
     */
    getSecondaryCsv: function(item, columns, primaryRow, encoding) {
        var me = this;
        if (!me.rowexp || !me.down('checkbox[name=secondarycolumns]').getValue() ) {
            return primaryRow;
        }
        var id = item.get(me.grid.rowtarget.dataIndex);
        var secondaryData = [];

        switch (me.rowexp.type) {
            case 'Lada.view.grid.Messung':
                secondaryData = me.secondaryData.filter(function(i) {
                    return i.probeId === id;
                });
                break;
            case 'Lada.view.grid.Messwert':
                secondaryData = me.secondaryData.filter(function(i) {
                    return i.messungsId === id;
                });
                break;
        }
        var result = '';
        if (!secondaryData.length) {
            result += primaryRow;
            for (var col=0; col < columns.length - 1; col++) {
                result += me.csv.colsep;
            }
            result += me.csv.linesep;
        }
        for (var e = 0; e < secondaryData.length; e++) {
            result += primaryRow
                + me.csv.colsep
                + me.addline(secondaryData[e], columns)
                + me.csv.linesep;
        }
        return result;
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
                if (columns[col].dataIndex === 'statusKombi') {
                    newvalue = record.statusProtokoll.statusKombi;
                } else {
                    newvalue = record[columns[col].dataIndex];
                }
            }
            line += col > 0 ? this.csv.colsep: '';
            var value = this.formatValue(newvalue, columns[col], false);
            switch ( typeof(value) ) {
                case 'number':
                    value = value.toString();
                    if (this.csv.decsep === ',' && value.indexOf('.') > -1) {
                        value = value.replace(/\./g, ',');
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

    resetCopyButton: function(scope) {
        var button = scope.down('button[action=copyGeoJson]');
        if (scope.down('combobox[name=formatselection]').getValue() === 'geojson') {
            button.setVisible(true);
            button.setText(
                Lada.getApplication().bundle.getMsg('export.button.copy'));
            button.setDisabled(false);
        } else {
            button.setVisible(false);
        }
    }

});
