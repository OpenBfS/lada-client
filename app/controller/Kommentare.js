Ext.define('Lada.controller.Kommentare', {
    extend: 'Ext.app.Controller',
    views: [
        'kommentare.List',
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
            'kommentarecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'kommentareedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },
    addKommentar: function(button) {
        console.log('Adding new Kommentar');
        var view = Ext.widget('kommentarecreate');
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
                store.remove(selection);
                store.sync();
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
    },
    editSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getKommentareStore();
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
