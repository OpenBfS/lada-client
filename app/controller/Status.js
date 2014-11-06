/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

Ext.define('Lada.controller.Status', {
    extend: 'Lada.controller.Base',

    views: [
        'status.Create'
    ],

    stores: [
        'Status'
    ],

    init: function() {
        this.callParent(arguments);
    },

    addListeners: function() {
        this.control({
            'statuslist': {
                itemdblclick: this.editItem
            },
            'statuslist toolbar button[action=add]': {
                click: this.addItem
            },
            'statuslist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'statuscreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'statuscreate button[action=save]': {
                click: this.saveItem
            },
            'statusedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },

    addItem: function(button) {
        var zusatzwert = Ext.create('Lada.model.Status');
        zusatzwert.set('probeId', button.probeId);
        zusatzwert.set('messungsId', button.parentId);
        var view = Ext.widget('statuscreate', {
            model: zusatzwert
        });
    },

    editItem: function(grid, record) {
        var mstore = Ext.data.StoreManager.get('Messungen');
        var messung = mstore.getById(record.get('messungsId'));
        record.getAuthInfo(this.initEditWindow, messung.get('probeId'));
    },

    initEditWindow: function(record, readonly, owner) {
        var view = Ext.widget('statuscreate', {
            model: record
        });
        var ignore = Array();
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },

    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getStatusStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },

    editSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getStatusStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
