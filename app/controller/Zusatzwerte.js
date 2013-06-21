Ext.define('Lada.controller.Zusatzwerte', {
    extend: 'Ext.app.Controller',
    views: [
        'zusatzwerte.Create'
    ],
    stores: [
        'Zusatzwerte',
        'Probenzusatzwerte'
    ],
    init: function() {
        console.log('Initialising the Zusatzwerte controller');
        this.control({
            // CSS like selector to select element in the viewpzusatzwert. See
            // ComponentQuery documentation for more details.
            'zusatzwertelist': {
                itemdblclick: this.editZusatzwert
            },
            'zusatzwertelist toolbar button[action=add]': {
                click: this.addZusatzwert
            },
            'zusatzwertelist toolbar button[action=delete]': {
                click: this.deleteZusatzwert
            },
            'zusatzwertecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'zusatzwertecreate button[action=save]': {
                click: this.saveZusatzwert
            },
            'zusatzwerteedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },
    saveZusatzwert: function(button) {
        console.log('Saving Zusatzwert');
        var form = button.up('window').down('form');
        var values = form.getForm().getValues();
        var model = form.model;
        // Set Probenzusatzwert and rebind the model to the form.
        var xxx = this.getProbenzusatzwerteStore();
        var probenzusatz = xxx.getAt(xxx.find('pzsId', values.pzsId));
        model.setProbenzusatz(probenzusatz);
        // Set ProbenId
        // model.probeId = 
        form.commit();
    },
    addZusatzwert: function(button) {
        console.log('Adding new Zusatzwert');
        var view = Ext.widget('zusatzwertecreate');
    },
    editZusatzwert: function(grid, record) {
        console.log('Editing Zusatzwert');
        var view = Ext.widget('zusatzwertecreate', {model: record});
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
        var store = this.getZusatzwerteStore();
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
        var store = this.getZusatzwerteStore();
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
