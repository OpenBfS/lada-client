/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for filter result grid.
 */
Ext.define('Lada.controller.FilterResult', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.window.ProbeEdit',
        'Lada.view.window.Messprogramm',
        'Lada.view.window.GenProbenFromMessprogramm'
    ],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'filterresultgrid': {
                itemdblclick: this.editItem
            },
            'filterresultgrid toolbar button[action=addProbe]': {
                click: this.addProbeItem
            },
            'filterresultgrid toolbar button[action=addMessprogramm]': {
                click: this.addMessprogrammItem
            },
            'filterresultgrid toolbar button[action=genProbenFromMessprogramm]': {
                click: this.genProbenFromMessprogramm
            },
            'filterresultgrid toolbar button[action=import]': {
                click: this.uploadFile
            },
            'filterresultgrid toolbar button[action=export]': {
                click: this.downloadFile
            },
            'filterresultgrid toolbar button[action=print]': {
                click: this.printSelection
            }
        });
        this.callParent(arguments);
    },

    /**
     * This function is called after a Row in the
     * {@link Lada.view.grid.FilterResult}
     * was double-clicked.
     * The function opens a {@link Lada.view.window.ProbeEdit}
     * or a {@link Lada.view.window.Messprogramm}.
     * To determine which window has to be opened, the function
     * analyse the records modelname.
     */
    editItem: function(grid, record) {
        var mname = record.store.model.modelName || '';
        var winname = '';

        //Based upon the Model that was loaded, act differently
        if (mname == 'Lada.model.ProbeList'){
            winname = 'Lada.view.window.ProbeEdit';
        }
        else if (mname == 'Lada.model.MessprogrammList'){
            winname = 'Lada.view.window.Messprogramm';
        }
        if (winname){
            var win = Ext.create(winname, {
                record: record,
                style: 'z-index: -1;' //Fixes an Issue where windows could not be created in IE8
             });
            win.show();
            win.initData();
        }
        else {
            console.log('The model is unknown.'
                +'No window was configured to display the data.'
                +'I retrieved a model named:' + mname
            );
        }
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
     * This function opens a new window to create a Probe
     * {@link Lada.view.window.Messprogramm}
     */
    addMessprogrammItem: function() {
        var win = Ext.create('Lada.view.window.Messprogramm');
        win.show();
        win.initData();
    },

    /**
     * This button creates a window to generate Proben
     * from a selected messprogramm.
     */
    genProbenFromMessprogramm: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        var proben = [];
        for (var i = 0; i < selection.length; i++) {
            proben.push(selection[i].get('id'));
        }
        var me = this;

        var winname = 'Lada.view.window.GenProbenFromMessprogramm';
        for (p in proben) {
            grid.setLoading(true);
            Ext.ClassManager.get('Lada.model.Messprogramm').load(proben[p], {
                failure: function(record, action) {
                    me.setLoading(false);
                    // TODO
                    console.log('An unhandled Failure occured. See following Response and Record');
                    console.log(action);
                    console.log(record);
                    },
                success: function(record, response) {
                    grid.setLoading(false);

                    var win = Ext.create(winname, {
                        record: record,
                        parentWindow: null
                    });
                    win.show();
                    win.initData();
                },
                scope: this
            });
        }
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
     * were selected in the {@link Lada.view.grid.FilterResult}
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
            url: 'lada-server/export/laf',
            jsonData: {'proben': proben},
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
                }
                // further error handling
                var json = Ext.JSON.decode(response.responseText);
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
                            i18n.getMsg('err.msg.laf.filecreatefailed'));
                    }
                } else {
                    Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                    i18n.getMsg('err.msg.laf.filecreatefailed'));
                }
            }
        });
    },

    /**
     * Send the selection to a Printservice
     */
    printSelection: function(button) {

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
                if (["owner", "readonly", "id"].indexOf(key) == -1){
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
            var grid = button.up('filterresultgrid');
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
            var grid = button.up('filterresultgrid');
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

        Ext.Ajax.request({
            url: 'lada-printer/buildreport.pdf',
            //configure a proxy in apache conf!
            jsonData: printData,
            binary: true,
            success: function(response) {
                var content = response.responseBytes;
                var filetype = response.getResponseHeader('Content-Type');
                var blob = new Blob([content],{type: filetype});
                saveAs(blob, 'lada-print.pdf');
                button.enable();
                button.setLoading(false);
            },
            failure: function(response) {
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
    },

    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    }
});
