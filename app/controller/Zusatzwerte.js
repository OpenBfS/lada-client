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
        console.log('Initialising the Zusatzwerte controller');
        this.callParent(arguments);
    },

    addListeners: function() {
        this.control({
            'zusatzwertelist': {
                itemdblclick: this.editItem
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
        console.log('Saving new Zusatzwert for Probe ' + button.probeId);
        var form = button.up('window').down('form');
        form.commit();
    },

    addItem: function(button) {
        console.log('Adding new Zusatzwert for Probe' + button.probeId);
        var zusatzwert = Ext.create('Lada.model.Zusatzwert');
        zusatzwert.set('probeId', button.probeId);
        Ext.widget('zusatzwertecreate', {
            model: zusatzwert
        });
    },

    editItem: function(grid, record) {
        console.log('Editing Zusatzwert');
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
