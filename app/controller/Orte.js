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
        'Orte'
    ],

    models: [
        'Ort'
    ],

    init: function() {
        this.callParent(arguments);
    },

    addListeners: function() {
        this.control({
            'ortelist toolbar button[action=open]': {
                click: this.editItem
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

    createOrt: function() {
        var win = Ext.create('Lada.view.orte.CreateOrt', {});
        win.show();
    },

    saveNewOrt: function(button) {
        var form = button.up('window').down('form').getForm();
        var ortdetailstore = Ext.getStore('Ortedetails');
        var ortdetail = Ext.create('Lada.model.Ortdetail');
        var fields = ['beschreibung', 'hoeheLand',
                      'latitude', 'longitude', 'staatId', 'gemId'];
        var i = 0;
        var ffield;
        for (i = fields.length - 1; i >= 0; i++) {
            ffield = form.findField('ort_' + fields[i]);
            ortdetail.set(fields[i], ffield.getValue());
        }
        ortdetailstore.add(ortdetail);
        ortdetailstore.sync({
            success: function(batch) {
                var od = Ext.ComponentQuery.query('ortdetail');
                var response = batch.operations[0].resultSet.records[0].data;
                od[0].setValue(response.ortId);
                button.up('window').close();
            },
            failure: function() {
                ortdetailstore.remove(ortdetail);
            }
        });
    },

    saveItem: function(button) {
        var form = button.up('window').down('form');
        var fform = form.getForm();

        var ortdetail = null;
        var ortdetailstore = Ext.getStore('Ortedetails');
        var newortdetail = false;

        var ortidfield = fform.findField('ortId');
        var ortid = ortidfield.getValue();
        if (ortid === null) {
            ortdetail = Ext.create('Lada.model.Ortdetail');
            ortdetailstore.add(ortdetail);
            newortdetail = true;
        }
        else {
            ortdetail = ortdetailstore.getById(ortid);
        }

        var fields = ['beschreibung', 'bezeichnung', 'hoeheLand',
                      'latitude', 'longitude', 'staatId', 'gemId'];
        var i = 0;
        var ffield;
        for (i = fields.length - 1; i >= 0; i--) {
            ffield = fform.findField('ort_' + fields[i]);
            ortdetail.set(fields[i], ffield.getValue());
        }
        // Create a new Ortedetail if nessecary
        ortdetailstore.sync({
            success: function(batch, options) {
                if (newortdetail) {
                    // Get ID from new created ortdetail and set it to the ort
                    var response =
                        options.operations.create[0]
                            .store.proxy.reader.jsonData;
                    form.model.set('ortId', response.ortId);
                }
                ortidfield.setValue(ortid);
            },
            failure: function() {
            }
        });
        form.commit();
    },

    addItem: function(button) {
        var ort = Ext.create('Lada.model.Ort');
        ort.set('probeId', button.probeId);
        Ext.widget('ortecreate', {
            model: ort
        });
    },

    editItem: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var ortId = selection.getId();
        var record = selection.store.getById(ortId);
        
        record.getAuthInfo(this.initEditWindow);
    },

    initEditWindow: function(record, readonly) {
        var view = Ext.widget('ortecreate', {
            model: record,
            edit: true
        });
        var ignore = [];
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },

    createSuccess: function(form) {
        // Reload store
        var store = this.getOrteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },

    editSuccess: function(form) {
        // Reload store
        var store = this.getOrteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
