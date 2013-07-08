Ext.define('Lada.controller.Kommentare', {
    extend: 'Ext.app.Controller',
    views: [
        'kommentare.Create'
    ],
    stores: [
        'Kommentare'
    ],
    models: [
        'Kommentar'
    ],
    init: function() {
        console.log('Initialising the Kommentare controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'kommentarelist': {
                itemdblclick: this.editKommentar
            },
            'kommentarelist toolbar button[action=add]': {
                click: this.addKommentar
            },
            'kommentarelist toolbar button[action=delete]': {
                click: this.deleteKommentar
            },
            'kommentarecreate button[action=save]': {
                click: this.saveKommentar
            },
            'kommentarecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            }
        });
    },
    saveKommentar: function(button) {
        console.log('Saving Kommentar');
        var form = button.up('window').down('form');
        form.commit();
    },
    addKommentar: function(button) {
        console.log('Adding new Kommentar for Probe ' + button.probeId);
        var kommentar = Ext.create('Lada.model.Kommentar');
        kommentar.set('probeId', button.probeId);
        var view = Ext.widget('kommentarecreate', {model: kommentar});
    },
    editKommentar: function(grid, record) {
        console.log('Editing Kommentar');
        var view = Ext.widget('kommentarecreate', {model: record});
        console.log("Loaded Kommentar with ID " + record.getId()); //outputs ID
    },
    deleteKommentar: function(button) {
        // Get selected item in grid
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
        // Reload store
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
