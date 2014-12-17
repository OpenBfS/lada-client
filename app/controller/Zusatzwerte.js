/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.Zusatzwerte', {
    extend: 'Lada.controller.Base',
    views: [
        'zusatzwerte.Create'
    ],

    stores: [
        'Zusatzwerte'
    ],

    init: function() {
        this.callParent(arguments);
    },

    addListeners: function() {
        this.control({
            'zusatzwertelist toolbar button[action=open]': {
                click: this.editItem
            },
            'zusatzwertelist toolbar button[action=add]': {
                click: this.addItem
            },
            'zusatzwertelist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'zusatzwertecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'zusatzwertecreate button[action=save]': {
                click: this.saveItem
            },
            'zusatzwerteedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },

    saveItem: function(button) {
        var form = button.up('window').down('form');
        form.commit();
    },

    addItem: function(button) {
        var zusatzwert = Ext.create('Lada.model.Zusatzwert');
        zusatzwert.set('probeId', button.probeId);
        Ext.widget('zusatzwertecreate', {
            model: zusatzwert
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
        var view = Ext.widget('zusatzwertecreate', {
            model: record
        });
        // Mark PZW Selection readonly.
        view.down('probenzusatzwert').disabled = true;
        var ignore = [];
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },

    createSuccess: function(form) {
        // Reload store
        var store = this.getZusatzwerteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },

    editSuccess: function(form) {
        // Reload store
        var store = this.getZusatzwerteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
