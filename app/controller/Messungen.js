Ext.define('Lada.controller.Messungen', {
    extend: 'Ext.app.Controller',
    views: [
        'messungen.Create'
    ],
    stores: [
        'Messungen',
        'Messwerte',
        'MKommentare',
        'Status'
    ],
    init: function() {
        console.log('Initialising the Messungen controller');
        this.control({
            // CSS like selector to select element in the viewpzusatzwert. See
            // ComponentQuery documentation for more details.
            'messungenlist': {
                itemdblclick: this.editZusatzwert
            },
            'messungenlist toolbar button[action=add]': {
                click: this.addZusatzwert
            },
            'messungenlist toolbar button[action=delete]': {
                click: this.deleteZusatzwert
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
    addZusatzwert: function(button) {
        console.log('Adding new Messung for Probe ' + button.probeId);
        var messung = Ext.create('Lada.model.Messung');
        messung.set('probeId', button.probeId);
        var view = Ext.widget('messungencreate', {model: messung});
    },
    editZusatzwert: function(grid, record) {
        console.log('Editing Zusatzwert');
        var view = Ext.widget('messungencreate', {model: record});
        console.log("Loaded Zusatzwert with ID " + record.getId()); //outputs ID
    },
    deleteZusatzwert: function(button) {
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
