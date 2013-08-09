/**
 * Controller for Proben
 */
Ext.define('Lada.controller.Proben', {
    extend: 'Lada.controller.Base',
    views: [
        'proben.Edit',
        'proben.Create'
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
            'probencreate button[action=save]': {
                click: this.saveItem
            },
            'probenedit button[action=save]': {
                click: this.saveItem
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
    editItem: function(grid, record) {
        console.log('Editing Probe');
        var id = record.get('probeId');
        var view = Ext.widget('probenedit', {modelId: id});

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
