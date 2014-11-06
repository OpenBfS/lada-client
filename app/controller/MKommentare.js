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
        'KommentareM'
    ],

    models: [
        'KommentarM'
    ],

    init: function() {
        console.log('Initialising the MKommentare controller');
        this.callParent(arguments);
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
        var kommentar = Ext.create('Lada.model.KommentarM');
        kommentar.set('probeId', button.probeId);
        kommentar.set('messungsId', button.parentId);
        Ext.widget('mkommentarecreate', {
            model: kommentar
        });
    },

    editItem: function(grid, record) {
        console.log('Editing Kommentar');
        var mstore = Ext.data.StoreManager.get('Messungen');
        var messung = mstore.getById(record.get('messungsId'));
        record.getAuthInfo(this.initEditWindow, messung.get('probeId'));
        console.log('Loaded MKommentar with ID ' + record.getId());
    },

    initEditWindow: function(record, readonly) {
        var view = Ext.widget('mkommentarecreate', {
            model: record
        });
        var ignore = [];
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },

    createSuccess: function(form) {
        // Reload store
        var store = this.getKommentareMStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
