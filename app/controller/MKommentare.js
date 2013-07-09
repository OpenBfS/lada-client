Ext.define('Lada.controller.MKommentare', {
    extend: 'Ext.app.Controller',
    views: [
        'mkommentare.Create'
    ],
    stores: [
        'MKommentare'
    ],
    models: [
        'MKommentar'
    ],
    init: function() {
        console.log('Initialising the MKommentare controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'mkommentarelist': {
                itemdblclick: this.editKommentar
            },
            'mkommentarelist toolbar button[action=add]': {
                click: this.addKommentar
            },
            'mkommentarelist toolbar button[action=delete]': {
                click: this.deleteKommentar
            },
            'mkommentarecreate button[action=save]': {
                click: this.saveKommentar
            },
            'mkommentarecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            }
        });
    },
    saveKommentar: function(button) {
        console.log('Saving MKommentar');
        var form = button.up('window').down('form');
        form.commit();
    },
    addKommentar: function(button) {
        console.log('Adding new MKommentar for Messung ' + button.parentId + ' Probe ' + button.probeId);
        var kommentar = Ext.create('Lada.model.MKommentar');
        kommentar.set('probeId', button.probeId);
        kommentar.set('messungsId', button.parentId);
        var view = Ext.widget('mkommentarecreate', {model: kommentar});
    },
    editKommentar: function(grid, record) {
        console.log('Editing Kommentar');
        var view = Ext.widget('mkommentarecreate', {model: record});
        console.log("Loaded MKommentar with ID " + record.getId()); //outputs ID
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
                console.log('Deleting MKommentar');
            } else {
                console.log('Cancel Deleting MKommentar');
            }
        });
    },
    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getMKommentareStore();
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
