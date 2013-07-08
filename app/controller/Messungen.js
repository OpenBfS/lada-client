Ext.define('Lada.controller.Messungen', {
    extend: 'Ext.app.Controller',
    views: [
        'messungen.Create'
    ],
    stores: [
        'Messungen',
        'Messwerte',
        'MKommentare',
        'Status',
        'Messgroessen'
    ],
    init: function() {
        console.log('Initialising the Messungen controller');
        this.control({
            // CSS like selector to select element in the viewpzusatzwert. See
            // ComponentQuery documentation for more details.
            'messungenlist': {
                itemdblclick: this.editMessung
            },
            'messungenlist toolbar button[action=add]': {
                click: this.addMessung
            },
            'messungenlist toolbar button[action=delete]': {
                click: this.deleteMessung
            },
            'messungencreate button[action=save]': {
                click: this.saveMessung
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
    saveMessung: function(button) {
        console.log('Saving new Messung for Probe ' + button.probeId);
        var form = button.up('window').down('form');
        form.commit();
    },
    addMessung: function(button) {
        console.log('Adding new Messung for Probe ' + button.probeId);
        var messung = Ext.create('Lada.model.Messung');
        messung.set('probeId', button.probeId);
        var view = Ext.widget('messungencreate', {model: messung});
    },
    editMessung: function(grid, record) {
        console.log('Editing Messung');
        var view = Ext.widget('messungencreate', {model: record});
        console.log("Loaded Messung with ID " + record.getId()); //outputs ID

        var kstore = this.getMKommentareStore();
        kstore.load({
            params: {
                probeId: probeId,
                messungsId: record.get('messungsId')
            }
        });
        var sstore = this.getStatusStore();
        sstore.load({
            params: {
                probeId: probeId,
                messungsId: record.get('messungsId')
            }
        });
        var mstore = this.getMessungwerteStore();
        mstore.load({
            params: {
                probeId: probeId,
                messungsId: record.get('messungsId')
            }
        });
    },
    deleteMessung: function(button) {
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
