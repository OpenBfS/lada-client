/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Controller for Orte
 */
Ext.define('Lada.controller.Orte', {
    extend: 'Lada.controller.Base',
    views: [
        'orte.List',
        'orte.Create',
        'orte.CreateOrt'
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
            'ortecreate form button[action=newort]': {
                click: this.createOrt
            },
            'createortdetail button[action=save]': {
                click: this.saveNewOrt
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
    createOrt: function(button) {
        console.log('button clicked');
        var win = Ext.create('Lada.view.orte.CreateOrt',{});
        win.show();
    },
    saveNewOrt: function(button) {
        console.log('button clicked');

        var form = button.up('window').down('form').getForm();
        var ortdetailstore = Ext.getStore('Ortedetails');
        var ortdetail = Ext.create('Lada.model.Ortdetail');
        var fields = ['beschreibung', 'hoeheLand',
                      'latitude', 'longitude', 'staatId', 'gemId'];
        for (var i = fields.length - 1; i >= 0; i--){
            var ffield = form.findField("ort_"+fields[i]);
            ortdetail.set(fields[i], ffield.getValue());
        }
        ortdetailstore.add(ortdetail);
        ortdetailstore.sync({
            success: function(batch, options) {
                console.log(batch);
                var od = Ext.ComponentQuery.query('ortdetail');
                console.log(od);
                batch.operations[0].resultSet.records[0].data;
                var response = batch.operations[0].resultSet.records[0].data;
                od[0].setValue(response.ortId);
                console.log('id:' + response.ortId);
                button.up('window').close();
            },
            failure: function() {
                console.log('Error on saving Ortdetails');
                ortdetailstore.remove(ortdetail);
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
            },
            failure: function() {
                console.log('Error on saving Ortdetails');
            }
        });
        form.commit();

    },
    addItem: function(button) {
        console.log('Adding new Ort for Probe ' + button.probeId);
        var ort = Ext.create('Lada.model.Ort');
        ort.set('probeId', button.probeId);
        var view = Ext.widget('ortecreate', {model: ort});
    },
    editItem: function(grid, record) {
        console.log('Editing Ort');
        record.getAuthInfo(this.initEditWindow)
        console.log("Loaded Ort with ID " + record.getId()); //outputs ID
    },
    initEditWindow: function(record, readonly, owner) {
        var view = Ext.widget('ortecreate', {model: record, edit: true});
        var ignore = Array();
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
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
