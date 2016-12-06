/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the ProbeList result grid.
 */
Ext.define('Lada.controller.grid.ProbeList', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.window.FileUpload',
        'Lada.view.window.ProbeEdit',
        'Lada.view.window.GenProbenFromMessprogramm'
    ],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'probelistgrid': {
                itemdblclick: this.editItem,
                select: this.activateButtons,
                deselect: this.deactivateButtons
            },
            'probelistgrid toolbar button[action=addProbe]': {
                click: this.addProbeItem
            },
            'probelistgrid toolbar button[action=import]': {
                click: this.uploadFile
            },
            'probelistgrid toolbar button[action=export]': {
                click: this.downloadFile
            },
            'probelistgrid toolbar button[action=printSheet]': {
                click: {
                    fn: this.printSelection,
                    mode: 'printsheet'
                }
            },
            'probelistgrid toolbar button[action=printExtract]': {
                click: {
                    fn: this.printSelection,
                    mode: 'printextract'
                }
            },
            'probelistgrid gridview': {
                expandbody: this.expandBody,
                collapsebody: this.collapseBody
            }
        });
        this.callParent(arguments);
    },

    /**
     * This function is called after a Row in the
     * {@link Lada.view.grid.ProbeList}
     * was double-clicked.
     * The function opens a {@link Lada.view.window.ProbeEdit}
     * or a {@link Lada.view.window.Messprogramm}.
     * To determine which window has to be opened, the function
     * analyse the records modelname.
     */
    editItem: function(grid, record) {
        var winname = 'Lada.view.window.ProbeEdit';

        var win = Ext.create(winname, {
            record: record,
            style: 'z-index: -1;' //Fixes an Issue where windows could not be created in IE8
        });
        win.setPosition(30);
        win.show();
        win.initData();
    },

    /**
     * This function opens a new window to create a Probe
     * {@link Lada.view.window.ProbeCreate}
     */
    addProbeItem: function() {
        var win = Ext.create('Lada.view.window.ProbeCreate');
        win.show();
        win.initData();
    },

    /**
     * This function opens a {@link Lada.view.window.FileUpload}
     * window to upload a LAF-File
     */
    uploadFile: function() {
        var win = Ext.create('Lada.view.window.FileUpload', {
            title: 'Datenimport',
            modal: true
        });

        win.show();
    },

    /**
     * This function can be used to Download the items which
     * were selected in the {@link Lada.view.grid.ProbeList}
     * The Download does not work with Internet Explorers older than v.10
     */
    downloadFile: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        var proben = [];
        for (var i = 0; i < selection.length; i++) {
            proben.push(selection[i].get('id'));
        }
        var me = this;
        Ext.Ajax.request({
            url: 'lada-server/data/export/laf',
            jsonData: {'proben': proben},
            timeout: 2 * 60 * 1000,
            success: function(response) {
                var content = response.responseText;
                var blob = new Blob([content],{type: 'text/plain'});
                saveAs(blob, 'export.laf');
            },
            failure: function(response) {
                /*
                SSO will send a 302 if the Client is not authenticated
                unfortunately this seems to be filtered by the browser.
                We assume that a 302 was send when the follwing statement
                is true.
                */
                if (response.status == 0 && response.responseText === "") {
                    Ext.MessageBox.confirm('Erneutes Login erforderlich',
                        'Ihre Session ist abgelaufen.<br/>'+
                        'Für ein erneutes Login muss die Anwendung neu geladen werden.<br/>' +
                        'Alle ungesicherten Daten gehen dabei verloren.<br/>' +
                        'Soll die Anwendung jetzt neu geladen werden?', this.reload);
                } else {
                    // further error handling
                    Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                    i18n.getMsg('err.msg.laf.filecreatefailed'));
                }
            }
        });
    },

    /**
     * Send the selection to a Printservice
     */
    printSelection: function(button, e, eOpts) {
        switch (eOpts.mode) {
            case "printextract" :
                var printData = this.createExtractData(button);
                this.printpdf(printData, 'lada_print', 'lada-print.pdf', button);
                break;
            case "printsheet" :
                // The Data is loaded from the server again, so we need
                // to be a little bit asynchronous here...
                callback = function(response) {
                    var data = response.responseText;
                    data = this.prepareData(data); // Wraps all messstellen and deskriptoren objects into an array
                    var printData = '{"layout": "A4 portrait", "outputFormat": "pdf",'
                            +   '"attributes": { "proben": ' +  data
                            +   '}}';
                    this.printpdf(printData, 'lada_erfassungsbogen',
                                  'lada-erfassungsbogen.pdf', button);
                }

                this.createSheetData(button, callback, this);
                break;
        }
    },

    prepareData: function(data) {
        // Copy data
        prep = JSON.parse(data);
        data = JSON.parse(data);
        // ensure data and prep are equal, not sure
        // if json.parse changes order of things
        console.log(data);

        emptyMessstelle = {
            "id": null,
            "amtskennung": null,
            "beschreibung": null,
            "messStelle": null,
            "mstTyp": null,
            "netzbetreiberId":null
        };

        emptyDeskriptor = {
            "s0":  null,
            "s1":  null,
            "s2":  null,
            "s3":  null,
            "s4":  null,
            "s5":  null,
            "s6":  null,
            "s7":  null,
            "s8":  null,
            "s9":  null,
            "s10": null,
            "s11": null
        };

        for (i in data) {
            probe = data[i];
            deskriptoren = probe.deskriptoren;
            messstelle = probe.messstelle;
            if (messstelle != null) {
                prep[i].messstelle = [];
                prep[i].messstelle[0] = messstelle;
            }
            else {
                prep[i].messstelle = [];
                prep[i].messstelle[0] = emptyMessstelle;
            }

            if (deskriptoren != null) {
                prep[i].deskriptoren = [];
                prep[i].deskriptoren[0] = deskriptoren;
            }
            else {
                prep[i].deskriptoren = [];
                prep[i].deskriptoren[0] = emptyDeskriptor;
            }
        }
        return JSON.stringify(prep);
    },

    /**
     * Toggles the buttons in the toolbar
     **/
    activateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        this.buttonToggle(true, grid);
    },

    /**
     * Toggles the buttons in the toolbar
     **/
    deactivateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        // Only disable buttons when nothing is selected
        if (rowModel.selected.items == 0) {
            this.buttonToggle(false, grid);
        }
    },

    /**
     * Enables/Disables a set of buttons
     **/
    buttonToggle: function(enabled, grid) {
        if (!enabled) {
            grid.down('button[action=export]').disable();
            grid.down('button[action=printExtract]').disable();
            grid.down('button[action=printSheet]').disable();
        }
        else {
            grid.down('button[action=export]').enable();
            grid.down('button[action=printExtract]').enable();
            grid.down('button[action=printSheet]').enable();
        }
    },

    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    },

    expandBody: function(rowNode, record, expandRow) {
//        var row = Ext.get('probe-row-' + record.get('id'));
//        var messungGrid = Ext.create('Lada.view.grid.Messung', {
//            recordId: record.get('id'),
//            bottomBar: false,
//            rowLines: true
//        });
//        row.swallowEvent(['click', 'mousedown', 'mouseup', 'dblclick'], true);
//        messungGrid.render(row);
    },

    collapseBody: function(rowNode, record, expandRow) {
//        var element = Ext.get('probe-row-' + record.get('id')).down('div');
//        element.destroy();
    },

    /**
     * Returns a Json-Object which contains the data which has
     * to be printed.
     * The parameter printFunctionCallback will be called once the ajax-request
     * starting the json-export was evaluated
     **/
    createSheetData: function(button, printFunctionCallback, cbscope){
        //disable Button and setLoading...
        button.disable();
        button.setLoading(true);


        // get Selected Items.
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var ids = [];

        for (item in selection) {
            ids.push(selection[item].data['id']);
        }

        //basically, thats the same as the downloadFile
        // code does.
        var data = '{ "proben": ['+ids.toString()+'] }';

        Ext.Ajax.request({
            url: 'lada-server/data/export/json',
            jsonData: data,
            binary: false,
            scope: cbscope,
            success: printFunctionCallback,
            failure: function(response) {
                console.log('failure');
                // Error handling
                // TODO
                console.log(response.responseText)
                button.enable();
                button.setLoading(false);
                if (response.responseText) {
                    try {
                        var json = Ext.JSON.decode(response.responseText);
                    }
                    catch(e){
                        console.log(e);
                    }
                }
                if (json) {
                    if(json.errors.totalCount > 0 || json.warnings.totalCount > 0){
                        formPanel.setMessages(json.errors, json.warnings);
                    }
                    if(json.message){
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.generic.title')
                            +' #'+json.message,
                            Lada.getApplication().bundle.getMsg(json.message));
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                            i18n.getMsg('err.msg.response.body'));
                    }
                } else {
                    Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                    i18n.getMsg('err.msg.response.body'));
                }
                return null;
            }
        });
    },

    /**
     * Returns a Json-Object which contains the data which has
     * to be printed.
     **/
    createExtractData: function(button){
        //disable Button and setLoading...
        button.disable();
        button.setLoading(true);

        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var columns = [];
        var columnNames = [];
        var visibleColumns = [];
        var displayName = '';
        var data = [];

        // Write the columns to an array
        try {
            for (key in selection[0].data) {
                // Do not write owner or readonly or id
                if (["owner", "readonly", "id", "probeId"].indexOf(key) == -1){
                    columns.push(key);
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        //Retrieve visible columns' id's and names.
        // and set displayName
        try {
            var grid = button.up('grid');
            var cman = grid.columnManager;
            var cols = cman.getColumns();

            displayName = grid.down('tbtext').text;

            for (key in cols) {
                if (cols[key].dataIndex) {
                    visibleColumns[cols[key].dataIndex] = cols[key].text;
                }
            }
        }
        catch (e) {
            console.log(e);
        }


        // Retrieve Data from selection
        try {
            for (item in selection) {
                var row = selection[item].data;
                var out = [];
                //Lookup every column and write to data array.
                for (key in columns){
                    var attr = columns[key];
                    //Only write data to output when the column is not hidden.
                    if (row[attr] != null &&
                        visibleColumns[attr] != null) {
                        out.push(row[attr].toString());
                    }
                    else if (visibleColumns[attr] != null) {
                        out.push('');
                    }
                }
                data.push(out);
            }
        }
        catch (e){
            console.log(e);
        }

        //Retrieve the names of the columns.
        try {
            var grid = button.up('grid');
            var cman = grid.columnManager;
            var cols = cman.getColumns();
            //Iterate columns and find column names for the key...
            // This WILL run into bad behaviour when column-keys exist twice.
            for (key in columns){
                for (k in cols){
                    if (cols[k].dataIndex == columns[key]){
                        columnNames.push(cols[k].text);
                        break;
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        var printData = {
            'layout': 'A4 landscape',
            'outputFormat': 'pdf',
            'attributes': {
                'title': 'Auszug aus LADA',
                'displayName': displayName,
                'table': {
                    'columns': columnNames,
                    'data': data
                }
            }
        }
        return printData;
    },

    /**
     * this function uses an AJAX request in order to
     * send the data to the endpoint of the mapfish-print
     */
    printpdf: function(data, endpoint, filename, button){
        Ext.Ajax.request({
            url: 'lada-printer/'+endpoint+'/buildreport.pdf',
            //configure a proxy in apache conf!
            jsonData: data,
            binary: true,
            success: function(response) {
                var content = response.responseBytes;
                var filetype = response.getResponseHeader('Content-Type');
                var blob = new Blob([content],{type: filetype});
                saveAs(blob, filename);
                button.enable();
                button.setLoading(false);
            },
            failure: function(response) {
                var i18n = Lada.getApplication().bundle;
                console.log('failure');
                // Error handling
                // TODO
                //console.log(response.responseText)
                button.enable();
                button.setLoading(false);
                if (response.responseText) {
                    try {
                        var json = Ext.JSON.decode(response.responseText);
                    }
                    catch(e){
                        console.log(e);
                    }
                }
                if (json) {
                    if(json.errors.totalCount > 0 || json.warnings.totalCount > 0){
                        formPanel.setMessages(json.errors, json.warnings);
                    }
                    if(json.message){
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.generic.title')
                            +' #'+json.message,
                            Lada.getApplication().bundle.getMsg(json.message));
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                            i18n.getMsg('err.msg.print.noContact'));
                    }
                } else {
                    Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                    i18n.getMsg('err.msg.print.noContact'));
                }
            }
        });
    }

});
