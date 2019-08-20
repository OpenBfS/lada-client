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
        'Lada.view.window.ProbeEdit'
    ],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'dynamicgrid toolbar button[action=addProbe]': {
                click: this.addProbeItem
            },
            'dynamicgrid toolbar button[action=importprobe]': {
                click: this.uploadFile
            },
            'dynamicgrid toolbar button[action=printSheet]': {
                click: this.printSelection
            }
        });
        this.callParent(arguments);
    },

    /**
     * This function opens a new window to create a Probe
     * {@link Lada.view.window.ProbeCreate}
     */
    addProbeItem: function() {
        var win = Ext.create('Lada.view.window.ProbeCreate');
        win.show();
        win.setPosition(30);
        win.initData();
    },

    /**
     * This function opens a {@link Lada.view.window.FileUpload}
     * window to upload a LAF-File
     */
    uploadFile: function() {
        var i18n = Lada.getApplication().bundle;
        var win = Ext.create('Lada.view.window.FileUpload', {
            title: i18n.getMsg('title.dataimport'),
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
        var callback = function(response) {
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
        var prep = JSON.parse(data);
        data = JSON.parse(data);
        // ensure data and prep are equal, not sure
        // if json.parse changes order of things

        var emptyMessstelle = {
            'id': null,
            'amtskennung': null,
            'beschreibung': null,
            'messStelle': null,
            'mstTyp': null,
            'netzbetreiberId': null
        };

        var emptyDeskriptor = {
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
            var probe = data[i];
            var deskriptoren = probe.deskriptoren;
            var messstelle = probe.messstelle;
            var labormessstelle = probe.labormessstelle;
            var ortszuordnung = probe.ortszuordnung;
            var zusatzwerte = probe.zusatzwerte;

            if (messstelle !== null) {
                prep[i].messstelle = [];
                prep[i].messstelle[0] = messstelle;
                prep[i]['messstelle.messStelle'] = messstelle.messStelle;
            } else {
                prep[i].messstelle = [];
                prep[i].messstelle[0] = emptyMessstelle;
                prep[i]['messstelle.messStelle'] = '';
            }

            if (labormessstelle !== null) {
                prep[i]['labormessstelle.messStelle'] = labormessstelle.messStelle;
            } else {
                prep[i]['labormessstelle.messStelle'] = '';
            }

            if (deskriptoren !== null) {
                prep[i].deskriptoren = [];
                prep[i].deskriptoren[0] = deskriptoren;
            } else {
                prep[i].deskriptoren = [];
                prep[i].deskriptoren[0] = emptyDeskriptor;
            }

            // Flatten the Ortszuodnung Array
            for (var o in ortszuordnung) {
                var oz = ortszuordnung[o];
                for (var e in oz.ort) {
                    prep[i].ortszuordnung[o]['ort']=null;
                    prep[i].ortszuordnung[o]['ort.'+e]=oz.ort[e];
                }
            }
        }

        return JSON.stringify(prep);
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

        // get Selected Items.
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        var ids = [];

        for (var item in selection) {
            ids.push(selection[item].get(grid.rowtarget.dataIndex));
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
     * this function uses an AJAX request in order to
     * send the data to the endpoint of the mapfish-print
     */
    // TODO: check if obsolete/mergeable  with generic printing in controller/DynamicGrid
    printpdf: function(data, endpoint, filename, button) {
        Ext.Ajax.request({
            url: 'lada-printer/print/'+endpoint+'/buildreport.pdf',
            //configure a proxy in apache conf!
            jsonData: data,
            binary: true,
            success: function(response) {
                var content = response.responseBytes;
                var filetype = response.getResponseHeader('Content-Type');
                var blob = new Blob([content],{type: filetype});
                saveAs(blob, filename);
                button.enable();

            },
            failure: function(response) {
                var i18n = Lada.getApplication().bundle;
                // Error handling
                button.enable();

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
