/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Controller for Kommentare on Messungen
 */
Ext.define('Lada.controller.MKommentare', {
    extend: 'Lada.controller.Base',
    views: [
        'mkommentare.Create'
    ],
    stores: [
        'MKommentare'
    ],
    models: [
        'MKommentar'
    ],
    init: function() {
        console.log('Initialising the MKommentare controller');
        this.callParent();
    },
    addListeners: function() {
        this.control({
            'mkommentarelist': {
                itemdblclick: this.editItem
            },
            'mkommentarelist toolbar button[action=add]': {
                click: this.addItem
            },
            'mkommentarelist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'mkommentarecreate button[action=save]': {
                click: this.saveItem
            },
            'mkommentarecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            }
        });
    },
    addItem: function(button) {
        console.log('Adding new MKommentar for Messung ' + button.parentId + ' Probe ' + button.probeId);
        var kommentar = Ext.create('Lada.model.MKommentar');
        kommentar.set('probeId', button.probeId);
        kommentar.set('messungsId', button.parentId);
        var view = Ext.widget('mkommentarecreate', {model: kommentar});
    },
    editItem: function(grid, record) {
        console.log('Editing Kommentar');
        record.getAuthInfo(this.initEditWindow)
        console.log("Loaded MKommentar with ID " + record.getId()); //outputs ID
    },
    initEditWindow: function(record, readonly, owner) {
        var view = Ext.widget('mkommentarecreate', {model: record});
        var ignore = Array();
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },
    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getMKommentareStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
