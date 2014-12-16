/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for Messwerte
 */
Ext.define('Lada.controller.Messwert', {
    extend: 'Lada.controller.Base',

    views: [
        'messwerte.Create'
    ],

    stores: [
        'Proben',
        'Messungen',
        'Messwerte'
    ],

    init: function() {
        this.callParent(arguments);
    },

    addListeners: function() {
        this.control({
            //'messwertelist': {
            //    itemdblclick: this.editItem
            //},
            'messwertelist toolbar button[action=add]': {
                click: this.addItem
            },
            'messwertelist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'messwertecreate button[action=save]': {
                click: this.saveItem
            },
            'messwertecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            }
        });
    },

    saveItem: function(button) {
        var form = button.up('window').down('form');
        form.commit();
    },

    addItem: function(button) {
        var messung = Ext.create('Lada.model.Messwert');
        messung.set('probeId', button.probeId);
        messung.set('messungsId', button.parentId);
        Ext.widget('messwertecreate', {
            model: messung
        });
    },

    editItem: function(grid, record) {
        var mstore = Ext.data.StoreManager.get('Messungen');
        var messung = mstore.getById(record.get('messungsId'));
        record.getAuthInfo(this.initEditWindow, messung.get('probeId'));
    },

    initEditWindow: function(record, readonly) {
        var view = Ext.widget('messwertecreate', {
            model: record
        });
        var ignore = [];
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },

    deleteItem: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                var store = grid.getStore();
                var deleteUrl = selection.getProxy().url + selection.getId();
                Ext.Ajax.request({
                    url: deleteUrl,
                    method: 'DELETE',
                    success: function() {
                        store.reload();
                    }
                });
            }
        });
    },

    createSuccess: function(form) {
        // Reload store
        var store = this.getMesswerteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },

    createFailure: function(form) {
        Ext.MessageBox.show({
            title: 'Fehler beim Speichern',
            msg: form.message,
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.Msg.OK
        });
    },

    editSuccess: function(form) {
        // Reload store
        var store = this.getMesswerteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },

    editFailure: function(form) {
        Ext.MessageBox.show({
            title: 'Fehler beim Speichern',
            msg: form.message,
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.Msg.OK
        });
    }
});
