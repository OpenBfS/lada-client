/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Controller for Proben
 */

function numOfErrors(proben) {
    var errors = 0;
    for (var key in proben) {
        if (proben[key].length > 0) {
            errors = errors + 1;
        }
    }
    return errors;
}

function buildImportReport(filename, msg, errors, warnings) {
    var out = Array();
    // There is a entry for each imported proben in the errors dict (might be
    // empty)
    var num_proben = (Object.keys(errors).length > 0);
    var num_errors = (numOfErrors(errors));
    var has_warnings = (Object.keys(warnings).length > 0);
    if (msg != 200) {
            out.push("Der Import der Datei " + filename + " war nicht erfolgreich. Der Importvorgang konnte aufgrund eines Fehlers im Server nicht beendet werden.");
    } else {
        if (num_errors == num_proben) {
            out.push("Der Import der Datei " + filename + " war nicht erfolgreich.");
        }
        else if (num_errors == 0) {
            out.push("Der Import der Datei " + filename + " war erfolgreich.");
        } else {
            out.push("Der Import der Datei " + filename + " war nicht oder nur teilweise erfolgreich.");
        }
        out.push(" Bei dem Import sind folgende Fehler und Warnungen aufgetreten:");
        out.push("<br/>");
        if (num_errors) {
            out.push("<strong>Fehler:</strong>");
            out.push("<br/>");
            out.push("<ol>");
            for (var key in errors) {
                out.push("<li>Probe: "+key)
                var msgs = errors[key];
                out.push("<ol>");
                for (var i = msgs.length - 1; i >= 0; i--){
                    out.push("<li>"+msgs[i].key+" ("+Lada.getApplication().bundle.getMsg(msgs[i].code.toString())+"): "+msgs[i].value+"</li>")
                };
                out.push("</ol>");
                out.push("</li>");
            }
            out.push("</ol>");
            out.push("<br/>");
        }
        if (has_warnings) {
            out.push("<strong>Warnungen:</strong>");
            out.push("<br/>");
            out.push("<ol>");
            for (var key in warnings) {
                out.push("<li>"+key)
                var msgs = warnings[key];
                out.push("<ol>");
                for (var i = msgs.length - 1; i >= 0; i--){
                    out.push("<li>"+msgs[i].key+" ("+Lada.getApplication().bundle.getMsg(msgs[i].code.toString())+"): "+msgs[i].value+"</li>")
                };
                out.push("</ol>");
                out.push("</li>");
            }
            out.push("</ol>");
        }
    }
    return out.join("");
}

Ext.define('Lada.controller.Proben', {
    extend: 'Lada.controller.Base',
    views: [
        'proben.Edit',
        'proben.Create',
        'proben.Import'
    ],
    stores: [
        'Proben',
        'Zusatzwerte',
        'Probenzusatzwerte',
        'KommentareP',
        'Orte',
        'Messungen'
    ],
    init: function() {
        console.log('Initialising the Proben controller');
        this.callParent();
    },
    addListeners: function() {
        this.control({
            'probenlist': {
                itemdblclick: this.editItem
            },
            'probenlist toolbar button[action=add]': {
                click: this.addItem
            },
            'probenlist toolbar button[action=import]': {
                click: this.selectUploadFile
            },
            'probenlist toolbar button[action=export]': {
                click: this.downloadFile
            },
            'probencreate button[action=save]': {
                click: this.saveItem
            },
            'probenedit button[action=save]': {
                click: this.saveItem
            },
            'probenimport button[action=save]': {
                click: this.uploadItem
            },
            'probencreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'probenedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },
    addItem: function(button) {
        console.log('Adding new Probe');
        var view = Ext.widget('probencreate');
    },
    /**
     * Opens a window with a file chooser to select the file to upload
     * @private
     */
    selectUploadFile: function(button) {
        console.log('Importing');
        var view = Ext.widget('probenimport');
    },
    /** Uploads the selected file the the server
     * @private
     */
    uploadItem: function(button) {
        var win = button.up('window');
        var form = win.down('form');
        if(form.isValid()){
            form.submit({
                url: 'server/rest/import/laf',
                waitMsg: 'Importiere...',
                // TODO: Handle the response correct. o must must contain the
                // filename (None) <2013-08-13 16:17>
                success: function(fp, resp) {
                    var errors = resp.result.data.errors;
                    var warnings = resp.result.data.warnings;
                    var filename = resp.result.data.filename;
                    var message = resp.result.message;
                    var dialogbody = buildImportReport(filename, message, errors, warnings)
                    var filename = resp.result.data.filename;
                    Ext.Msg.alert('Erfolg', dialogbody);
                    win.close();
                },
                failure: function(fp, resp) {
                    var errors = resp.result.data.errors;
                    var warnings = resp.result.data.warnings;
                    var filename = resp.result.data.filename;
                    var message = resp.result.message;
                    var dialogbody = buildImportReport(filename, message, errors, warnings)
                    Ext.Msg.alert('Fehler', dialogbody);
                    win.close();
                }
            });
        }
    },
    /**
     * Will download the selected Probe in LAF format in a new window (tab).
     */
    downloadFile: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var hiddenItems = [];
        for (var i = 0; i < selection.length; i++) {
            hiddenItems.push({xtype: 'hiddenfield', name: 'probeId', value: selection[i].get('probeId')});
        }
        console.log('create download form.');
        var hiddenForm = Ext.create('Ext.form.Panel', {
            title: 'hiddenForm',
            standardSubmit: true,
            url: 'server/rest/export/laf',
            timeout: 120,
            height: 0,
            width: 0,
            hidden: true,
            items: hiddenItems
        });
        hiddenForm.getForm().submit();
    },
    editItem: function(grid, record) {
        console.log('Editing Probe');
        var id = record.get('id');
        console.log('id is: ' + id);
        // Load Zusatzwerte
        var pstore = this.getProbenzusatzwerteStore();
        pstore.load();
        var zstore = this.getZusatzwerteStore();
        zstore.load({
            params: {
                probeId: id
            }
        });
        // Load Kommentare
        var kstore = this.getKommentarePStore();
        kstore.load({
            params: {
                probeId: id
            }
        });
        // Load Orte
        var ostore = this.getOrteStore();
        ostore.load({
            params: {
                probeId: id
            }
        });
        // Load Orte
        var mstore = this.getMessungenStore();
        mstore.load({
            params: {
                probeId: id
            }
        });
        var view = Ext.widget('probenedit', {modelId: id});
        view.show();
        console.log("Loaded Probe with ID " + record.getId()); //outputs ID
    },
    createSuccess: function(form, record, response) {
        // Close Createdialog
        var win = form.up('window');
        win.close();
        var store = this.getProbenStore();
        //Load or reload the probenstore.
        if (store.getCount() === 0) {
            store.load({
                scope: this,
                callback: function(records, operation, success) {
                    console.log('Loaded store');
                    // Open Editdialog
                    var json = Ext.decode(response.responseText);
                    if (json) {
                        var probeId = json.data.probeId;
                        var probe = store.findRecord("probeId", probeId);
                        this.editItem(null, probe);
                    }
                }
            });
        }
        else {
            store.reload({
                scope: this,
                callback: function(records, operation, success) {
                    console.log('Reloaded store');
                    // Open Editdialog
                    var json = Ext.decode(response.responseText);
                    if (json) {
                        var probeId = json.data.probeId;
                        var probe = store.findRecord("probeId", probeId);
                        this.editItem(null, probe);
                    }
                }
            });
        }
    },
    editSuccess: function(form, record, response) {
        // Reload store
        var store = this.getProbenStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
