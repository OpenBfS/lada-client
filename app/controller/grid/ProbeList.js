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
            'probelistgrid toolbar button[action=deleteSelected]': {
                click: this.deleteSelected
            },
            'probelistgrid toolbar button[action=printSheet]': {
                click: {
                    fn: this.printSelection,
                    mode: 'printsheet'
                }
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
        win.setPosition(30);
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
            modal: true,
            width: 260
        });

        win.show();
    },

    /**
     * Send the selection to a Printservice
     */
    printSelection: function(button, e, eOpts) {
        // The Data is loaded from the server again, so we need
        // to be a little bit asynchronous here...
        callback = function(response) {
            var data = response.responseText;
            data = this.prepareData(data); // Wraps all messstellen and deskriptoren objects into an array
            var printData = '{"layout": "A4 portrait", "outputFormat": "pdf",'
                    + '"attributes": { "proben": ' + data
                    + '}}';
            this.printpdf(printData, 'lada_erfassungsbogen',
                'lada-erfassungsbogen.pdf', button);
        };

        this.createSheetData(button, callback, this);
    },

    prepareData: function(data) {
        // Copy data
        prep = JSON.parse(data);
        data = JSON.parse(data);
        // ensure data and prep are equal, not sure
        // if json.parse changes order of things

        emptyMessstelle = {
            'id': null,
            'amtskennung': null,
            'beschreibung': null,
            'messStelle': null,
            'mstTyp': null,
            'netzbetreiberId': null
        };

        emptyDeskriptor = {
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
            probe = data[i];
            deskriptoren = probe.deskriptoren;
            messstelle = probe.messstelle;
            labormessstelle = probe.labormessstelle;
            ortszuordnung = probe.ortszuordnung;
            zusatzwerte = probe.zusatzwerte;

            if (messstelle != null) {
                prep[i].messstelle = [];
                prep[i].messstelle[0] = messstelle;
                prep[i]['messstelle.messStelle'] = messstelle.messStelle;
            } else {
                prep[i].messstelle = [];
                prep[i].messstelle[0] = emptyMessstelle;
                prep[i]['messstelle.messStelle'] = '';
            }

            if (labormessstelle != null) {
                prep[i]['labormessstelle.messStelle'] = labormessstelle.messStelle;
            } else {
                prep[i]['labormessstelle.messStelle'] = '';
            }

            if (deskriptoren != null) {
                prep[i].deskriptoren = [];
                prep[i].deskriptoren[0] = deskriptoren;
            } else {
                prep[i].deskriptoren = [];
                prep[i].deskriptoren[0] = emptyDeskriptor;
            }

            // See: app/view/grid/Probenzusatzwert.js
            // Calculate NWG < symbol , as this is NOT done by the server
            for (z in zusatzwerte) {
                var nwg = zusatzwerte[z]['nwgZuMesswert'];
                var mw = zusatzwerte[z]['messwertPzs'];
                if ( mw < nwg) {
                    prep[i].zusatzwerte[z]['messwertNwg'] = '<';
                } else {
                    prep[i].zusatzwerte[z]['messwertNwg'] = null;
                }
            }

            // Flatten the Ortszuodnung Array
            for (var o in ortszuordnung) {
                oz = ortszuordnung[o];
                for (var e in oz.ort) {
                    prep[i].ortszuordnung[o]['ort']=null;
                    prep[i].ortszuordnung[o]['ort.'+e]=oz.ort[e];
                }
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
            grid.down('button[action=deleteSelected]').disable();
            grid.down('button[action=printSheet]').disable();
        } else {
            grid.down('button[action=deleteSelected]').enable();
            grid.down('button[action=printSheet]').enable();
        }
    },

    /**
     * Returns a Json-Object which contains the data which has
     * to be printed.
     * The parameter printFunctionCallback will be called once the ajax-request
     * starting the json-export was evaluated
     **/
    // TODO: check if getting json printing could be refactored with gridexport
    createSheetData: function(button, printFunctionCallback, cbscope) {
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
                // Error handling
                console.log(response);
                button.enable();
                button.setLoading(false);
                if (response.responseText) {
                    try {
                        var json = Ext.JSON.decode(response.responseText);
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (json) {
                    if (json.errors.totalCount > 0 || json.warnings.totalCount > 0) {
                        formPanel.setMessages(json.errors, json.warnings);
                    }
                    if (json.message) {
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
     * Deletes selected list items
     */
    deleteSelected: function(button) {
        var me = button.up('grid');
        var selection = me.getView().getSelectionModel().getSelection();
        var win = Ext.create('Lada.view.window.DeleteMultipleProbe', {
            selection: selection,
            parentWindow: me
        });
        win.show();
    },

    /**
     * this function uses an AJAX request in order to
     * send the data to the endpoint of the mapfish-print
     */
    // TODO: check if obsolete/mergeable  with generic printing in controller/DynamicGrid
    printpdf: function(data, endpoint, filename, button) {
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
                // Error handling
                button.enable();
                button.setLoading(false);
                if (response.responseText) {
                    try {
                        var json = Ext.JSON.decode(response.responseText);
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (json) {
                    if (json.errors.totalCount > 0 || json.warnings.totalCount > 0) {
                        formPanel.setMessages(json.errors, json.warnings);
                    }
                    if (json.message) {
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
