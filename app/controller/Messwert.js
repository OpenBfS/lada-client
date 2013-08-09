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
        'Messwerte',
        'Messeinheit',
        'Messgroessen'
    ],
    init: function() {
        console.log('Initialising the Messwert controller');
        this.callParent();
    },
    addListeners: function() {
        this.control({
            'messwertelist': {
                itemdblclick: this.editItem
            },
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
        console.log('Saving MesswerMesswert');
        var form = button.up('window').down('form');
        form.commit();
    },
    addItem: function(button) {
        console.log('Adding new Messwert for Messung ' + button.parentId + ' for Probe ' + button.probeId);
        var messung = Ext.create('Lada.model.Messwert');
        messung.set('probeId', button.probeId);
        messung.set('messungsId', button.parentId);
        var view = Ext.widget('messwertecreate', {model: messung});
    },
    editItem: function(grid, record) {
        console.log('Editing Messwert');
        var probe = this.getProbenStore().getById(record.get('probeId'));
        var view = Ext.widget('messwertecreate', {model: record});
        if (probe.get('readonly') === true) {
            var form = view.down('form');
            form.setReadOnly(true);
        }

        console.log("Loaded Messwert with ID " + record.getId()); //outputs ID
    },
    deleteItem: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn){
            if(btn === 'yes'){
                var store = grid.getStore();
                var deleteUrl = selection.getProxy().url + selection.getEidi();
                Ext.Ajax.request({
                    url: deleteUrl,
                    method: 'DELETE',
                    success: function(response, opts) {
                        store.reload();
                    }
                });
                console.log('Deleting Messwert');
            } else {
                console.log('Cancel Deleting Messwert');
            }
        });
    },
    createSuccess: function(form, record, operation) {
        // Reload store
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
        // Reload store
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
