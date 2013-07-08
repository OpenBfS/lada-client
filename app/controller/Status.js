Ext.define('Lada.controller.Status', {
    extend: 'Ext.app.Controller',
    views: [
        'status.Create'
    ],
    stores: [
        'Status'
    ],
    init: function() {
        console.log('Initialising the Status controller');
        this.control({
            // CSS like selector to select element in the viewpzusatzwert. See
            // ComponentQuery documentation for more details.
            'statuslist': {
                itemdblclick: this.editStatus
            },
            'statuslist toolbar button[action=add]': {
                click: this.addStatus
            },
            'statuslist toolbar button[action=delete]': {
                click: this.deleteStatus
            },
            'statuscreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'statuscreate button[action=save]': {
                click: this.saveStatus
            },
            'statusedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },
    saveStatus: function(button) {
        console.log('Saving Status');
        var form = button.up('window').down('form');
        form.commit();
    },
    addStatus: function(button) {
        console.log('Adding new Status for Messung ' + button.parentId + ' in Probe ' + button.probeId);
        var zusatzwert = Ext.create('Lada.model.Status');
        zusatzwert.set('probeId', button.probeId);
        zusatzwert.set('messungsId', button.parentId);
        var view = Ext.widget('statuscreate', {model: zusatzwert});
    },
    editStatus: function(grid, record) {
        console.log('Editing Status');
        var view = Ext.widget('statuscreate', {model: record});
        console.log("Loaded Status with ID " + record.getId()); //outputs ID
    },
    deleteStatus: function(button) {
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
        var store = this.getStatusStore();
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
        var store = this.getStatusStore();
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
