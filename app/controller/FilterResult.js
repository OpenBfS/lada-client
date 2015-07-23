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
        'Lada.view.window.Messprogramm'
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
            }
        });
        this.callParent(arguments);
    },

    /**
     * This function is called after a Row in the
     * {@link Lada.view.grid.FilterResult}
     * was double-clicked.
     * The function opens a {@link Lada.view.window.ProbeEdit}
     * or a {@link Lada.view.window.MessprogrammEdit}.
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
     * {@link Lada.view.window.MessprogrammCreate}
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
            method: 'POST',
            url: 'lada-server/export/laf',
            jsonData: {'proben': proben},
            headers: {'X-OPENID-PARAMS': Lada.openIDParams},
            success: function(response) {
                var content = response.responseText;
                var blob = new Blob([content],{type: 'text/plain'});
                saveAs(blob, 'export.laf');
            },
            failure: function(response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json) {
                    if(json.errors.totalCount > 0 || json.warnings.totalCount > 0){
                        formPanel.setMessages(json.errors, json.warnings);
                    }
                    // TODO Move this handling of 699 and 698 to a more central place!
                    // TODO i18n
                    if (json.message === "699" || json.message === "698") {
                        /* This is the unauthorized message with the authentication
                            * redirect in the data */

                        /* We decided to handle this with a redirect to the identity
                            * provider. In which case we have no other option then to
                            * handle it here with relaunch. */
                        Ext.MessageBox.confirm('Erneutes Login erforderlich',
                            'Der Server konnte die Anfrage nicht authentifizieren.<br/>'+
                            'Für ein erneutes Login muss die Anwendung neu geladen werden.<br/>' +
                            'Alle ungesicherten Daten gehen dabei verloren.<br/>' +
                            'Soll die Anwendung jetzt neu geladen werden?', me.reload);
                    }
                    else if(json.message){
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

    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    }
});
