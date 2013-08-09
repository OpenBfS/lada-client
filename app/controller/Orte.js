/**
 * Controller for Orte
 */
Ext.define('Lada.controller.Orte', {
    extend: 'Lada.controller.Base',
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
        this.callParent();
    },
    addListeners: function() {
        this.control({
            'ortelist': {
                itemdblclick: this.editItem
            },
            'ortelist toolbar button[action=add]': {
                click: this.addItem
            },
            'ortelist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'ortecreate button[action=save]': {
                click: this.saveItem
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
    saveItem: function(button) {
        console.log('Saving Ort');
        var form = button.up('window').down('form');
        var fform = form.getForm();

        var ortdetail = null;
        var ortdetailstore = Ext.getStore('Ortedetails');
        var newortdetail = false;

        var ortidfield = fform.findField('ortId');
        var ortid = ortidfield.getValue();
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
                ortidfield.setValue(ortid);
                form.commit();
            },
            failure: function() {
                console.log('Error on saving Ortdetails');
            }
        });

    },
    addItem: function(button) {
        console.log('Adding new Ort for Probe ' + button.probeId);
        var ort = Ext.create('Lada.model.Ort');
        ort.set('probeId', button.probeId);
        var view = Ext.widget('ortecreate', {model: ort});
    },
    editItem: function(grid, record) {
        console.log('Editing Ort');
        var view = Ext.widget('ortecreate', {model: record});
        console.log("Loaded Ort with ID " + record.getId()); //outputs ID
    },
    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getOrteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },
    editSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getOrteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
