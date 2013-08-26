/**
 * Controller for Proben
 */

function buildImportReport(filename, msg, errors, warnings) {
    var out = Array();
    if (msg != 200) {
        out.push("Der Import der Datei " + filename + " war nicht erfolgreich.");
        out.push("Bei dem Import sind folgende Fehler und Warnungen aufgetreten");
        out.push("<br/>");
        out.push("<strong>Fehler:</strong>");
        out.push("<br/>");
        if (errors) {
            out.push("<ol>");
            for (var key in errors) {
                out.push("<li>"+key+"</li>");
            }
            out.push("</ol>");
        } else {
            out.push("Keine Fehler");
            out.push("<br/>");
        }
        out.push("<strong>Warnungen:</strong>");
        out.push("<br/>");
        if (warnings) {
            out.push("<ol>");
            for (var key in warnings) {
                out.push("<li>"+key+"</li>");
            }
            out.push("</ol>");
        } else {
            out.push("Keine Warnungen");
            out.push("<br/>");
        }
    } else {
        out.push("Der Import der Datei " + filename + " war erfolgreich.");
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
        'Kommentare',
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
                    var filename = resp.result.data[2].filename;
                    Ext.Msg.alert('Erfolg! ', 'Die Datei "' + filename + '" wurde erfolgreich importiert.');
                    win.close();
                },
                failure: function(fp, resp) {
                    var errors = resp.result.data[0];
                    var warnings = resp.result.data[1];
                    var filename = resp.result.data[2].filename;
                    var message = resp.message;
                    var dialogbody = buildImportReport(filename, message, errors.parser, warnings)
                    Ext.Msg.alert('Fehler', dialogbody);
                    win.close();
                }
            });
        }
    },
    editItem: function(grid, record) {
        console.log('Editing Probe');
        var id = record.get('probeId');
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
        var kstore = this.getKommentareStore();
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
        console.log("Loaded Probe with ID " + record.getId()); //outputs ID
    },
    createSuccess: function(form, record, response) {
        // Close Createdialog
        var win = form.up('window');
        win.close();
        // Reload store
        var store = this.getProbenStore();
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
    },
    editSuccess: function(form, record, response) {
        // Reload store
        var store = this.getProbenStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
