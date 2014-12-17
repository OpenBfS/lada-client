/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for Kommentare
 */
Ext.define('Lada.controller.Kommentare', {
    extend: 'Lada.controller.Base',

    views: [
        'kommentare.Create'
    ],

    stores: [
        'KommentareP'
    ],

    models: [
        'KommentarP'
    ],

    init: function() {
        this.callParent();
    },

    addListeners: function() {
        this.control({
            'kommentarelist toolbar button[action=open]': {
                click: this.editItem
            },
            'kommentarelist toolbar button[action=add]': {
                click: this.addItem
            },
            'kommentarelist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'kommentarecreate button[action=save]': {
                click: this.saveItem
            },
            'kommentarecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            }
        });
    },

    addItem: function(button) {
        var kommentar = Ext.create('Lada.model.KommentarP');
        kommentar.set('probeId', button.probeId);
        Ext.widget('kommentarecreate', {
            model: kommentar
        });
    },

    editItem: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var id = selection.getId();
        var record = selection.store.getById(id);

        record.getAuthInfo(this.initEditWindow);
    },

    initEditWindow: function(record, readonly) {
        var view = Ext.widget('kommentarecreate', {
            model: record
        });
        var ignore = [];
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },

    createSuccess: function(form) {
        var store = this.getKommentarePStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
