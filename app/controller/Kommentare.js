/**
 * Controller for Kommentare
 */
Ext.define('Lada.controller.Kommentare', {
    extend: 'Lada.controller.Base',
    views: [
        'kommentare.Create'
    ],
    stores: [
        'Kommentare'
    ],
    models: [
        'Kommentar'
    ],
    addListeners: function() {
        this.control({
            'kommentarelist': {
                itemdblclick: this.editItem
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
    saveItem: function(button) {
        console.log('Saving Kommentar');
        var form = button.up('window').down('form');
        form.commit();
    },
    addItem: function(button) {
        console.log('Adding new Kommentar for Probe ' + button.probeId);
        var kommentar = Ext.create('Lada.model.Kommentar');
        kommentar.set('probeId', button.probeId);
        var view = Ext.widget('kommentarecreate', {model: kommentar});
    },
    editItem: function(grid, record) {
        console.log('Editing Kommentar');
        var view = Ext.widget('kommentarecreate', {model: record});
        console.log("Loaded Kommentar with ID " + record.getId()); //outputs ID
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
                console.log('Deleting Kommentar');
            } else {
                console.log('Cancel Deleting Kommentar');
            }
        });
    },
    createSuccess: function(form, record, operation) {
        var store = this.getKommentareStore();
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
    }
});
