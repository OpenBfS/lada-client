/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Controller for Messungen
 */
Ext.define('Lada.controller.Messungen', {
    extend: 'Lada.controller.Base',

    views: [
        'messungen.Create',
        'messungen.Edit'
    ],

    stores: [
        'Proben',
        'Messungen',
        'Messwerte',
        'KommentareM',
        'Status',
        'StaMessgroessen'
    ],

    init: function() {
        console.log('Initialising the Messungen controller');
        this.callParent();
    },

    addListeners: function() {
        this.control({
            'messungenlist': {
                itemdblclick: this.editItem
            },
            'messungenlist toolbar button[action=add]': {
                click: this.addItem
            },
            'messungenlist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'messungencreate button[action=save]': {
                click: this.saveItem
            },
            'messungenedit button[action=save]': {
                click: this.saveItem
            },
            'messungencreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'messungenedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },

    saveItem: function(button) {
        console.log('Saving new Messung for Probe ' + button.probeId);
        var form = button.up('window').down('form');
        form.commit();
    },

    addItem: function(button) {
        console.log('Adding new Messung for Probe ' + button.probeId);
        var messung = Ext.create('Lada.model.Messung');
        messung.set('probeId', button.probeId);
        var view = Ext.widget('messungencreate', {model: messung});
    },

    editItem: function(grid, record) {
        console.log('Editing Messung');
        var kstore = this.getKommentareMStore();
        kstore.load({
            params: {
                probeId: record.get('probeId'),
                messungsId: record.get('id')
            }
        });
        var sstore = this.getStatusStore();
        sstore.load({
            params: {
                probeId: record.get('probeId'),
                messungsId: record.get('id')
            }
        });
        var mstore = this.getMesswerteStore();
        mstore.load({
            params: {
                probeId: record.get('probeId'),
                messungsId: record.get('id')
            }
        });
        record.getAuthInfo(this.initEditWindow);
        console.log("Loaded Messung with ID " + record.getId()); //outputs ID
    },

    initEditWindow: function(record, readonly, owner) {
        var view = Ext.widget('messungenedit', {
            model: record
        });
        var ignore = Array();
        if (owner) {
                ignore.push('fertig');
        }
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },

    deleteItem: function(button) {
        // Get selected item in grid
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                var store = grid.getStore();
                var deleteUrl = selection.getProxy().url + selection.getId();
                Ext.Ajax.request({
                    url: deleteUrl,
                    method: 'DELETE',
                    success: function(response, opts) {
                        store.reload();
                    }
                });
                console.log('Deleting Messung');
            } else {
                console.log('Cancel Deleting Messung');
            }
        });
    },

    createSuccess: function(form, record, operation) {
        var store = this.getMessungenStore();
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
        var store = this.getMessungenStore();
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
