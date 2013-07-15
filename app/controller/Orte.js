Ext.define('Lada.controller.Orte', {
    extend: 'Ext.app.Controller',
    views: [
        'orte.List',
        'orte.Create'
    ],
    stores: [
        'Orte',
        'Ortedetails',
        'Staaten',
        'Verwaltungseinheiten'
    ],
    models: [
        'Ort'
    ],
    init: function() {
        console.log('Initialising the Orte controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'ortelist': {
                itemdblclick: this.editOrt
            },
            'ortelist toolbar button[action=add]': {
                click: this.addOrt
            },
            'ortelist toolbar button[action=delete]': {
                click: this.deleteOrt
            },
            'ortecreate button[action=save]': {
                click: this.saveOrt
            },
            'ortecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'orteedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },
    saveOrt: function(button) {
        console.log('Saving Ort');
        var form = button.up('window').down('form');
        var fform = form.getForm();

        var ortdetail = null;
        var ortdetailstore = Ext.getStore('Ortedetails');
        var newortdetail = false;

        var ortid = fform.findField('ortId').getValue();
        if (ortid === null) {
            console.log('New Ortdetail');
            ortdetail = Ext.create('Lada.model.Ortdetail');
            ortdetailstore.add(ortdetail);
            newortdetail = true;
        } else {
            console.log('Editing Ortdetail');
            ortdetail = ortdetailstore.getById(ortid);
        }

        var fields = ['beschreibung', 'bezeichnung', 'hoeheLand',
                      'latitude', 'longitude', 'staatId', 'gemId'];
        for (var i = fields.length - 1; i >= 0; i--){
            ffield = fform.findField("ort_"+fields[i]);
            ortdetail.set(fields[i], ffield.getValue());
        }
        // Create a new Ortedetail if nessecary
        ortdetailstore.sync({
            success: function(batch, options) {
                if (newortdetail) {
                    // Get ID from new created ortdetail and set it to the ort
                    var response = options.operations.create[0].store.proxy.reader.jsonData;
                    form.model.set('ortId', response.ortId);
                }
                form.commit();
            },
            failure: function() {
                console.log('Error on saving Ortdetails');
            }
        });

    },
    addOrt: function(button) {
        console.log('Adding new Ort for Probe ' + button.probeId);
        var ort = Ext.create('Lada.model.Ort');
        ort.set('probeId', button.probeId);
        var view = Ext.widget('ortecreate', {model: ort});
    },
    editOrt: function(grid, record) {
        console.log('Editing Ort');
        var view = Ext.widget('ortecreate', {model: record});
        console.log("Loaded Ort with ID " + record.getId()); //outputs ID
    },
    deleteOrt: function(button) {
        // Get selected item in grid
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn){
            if(btn === 'yes'){
                var store = grid.getStore();
                store.remove(selection);
                store.sync();
                console.log('Deleting Kommentar');
            } else {
                console.log('Cancel Deleting Kommentar');
            }
        });
    },
    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getOrteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },
    createFailure: function(form, record, operation) {
        Ext.MessageBox.show({
            title: 'Fehler beim Speichern',
            msg: form.message,
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.Msg.OK
        });
    },
    editSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getOrteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },
    editFailure: function(form, record, operation) {
        Ext.MessageBox.show({
            title: 'Fehler beim Speichern',
            msg: form.message,
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.Msg.OK
        });
    }
});
