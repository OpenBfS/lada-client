Ext.define('Lada.controller.Messungen', {
    extend: 'Ext.app.Controller',
    views: [
        'messungen.Create',
        'messungen.Edit'
    ],
    stores: [
        'Proben',
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
        var kstore = this.getMKommentareStore();
        kstore.load({
            params: {
                probeId: record.get('probeId'),
                messungsId: record.get('messungsId')
            }
        });
        var sstore = this.getStatusStore();
        sstore.load({
            params: {
                probeId: record.get('probeId'),
                messungsId: record.get('messungsId')
            }
        });
        var mstore = this.getMesswerteStore();
        mstore.load({
            params: {
                probeId: record.get('probeId'),
                messungsId: record.get('messungsId')
            }
        });
        var probe = this.getProbenStore().getById(record.get('probeId'));
        var view = Ext.widget('messungenedit', {model: record});
        if (probe.get('readonly') === true) {
            var form = view.down('form');
            form.setReadOnly(true);
        }
        console.log("Loaded Messung with ID " + record.getId()); //outputs ID
    },
    deleteMessung: function(button) {
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
                console.log('Deleting Messung');
            } else {
                console.log('Cancel Deleting Messung');
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
