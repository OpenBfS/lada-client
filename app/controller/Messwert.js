Ext.define('Lada.controller.Messwert', {
    extend: 'Ext.app.Controller',
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
        console.log('Initialising the Messungen controller');
        this.control({
            // CSS like selector to select element in the viewpzusatzwert. See
            // ComponentQuery documentation for more details.
            'messwertelist': {
                itemdblclick: this.editMesswert
            },
            'messwertelist toolbar button[action=add]': {
                click: this.addMesswert
            },
            'messwertelist toolbar button[action=delete]': {
                click: this.deleteMesswert
            },
            'messwertecreate button[action=save]': {
                click: this.saveMesswert
            },
            'messwertecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            }
        });
    },
    saveMesswert: function(button) {
        console.log('Saving MesswerMesswert');
        var form = button.up('window').down('form');
        form.commit();
    },
    addMesswert: function(button) {
        console.log('Adding new Messwert for Messung ' + button.parentId + ' for Probe ' + button.probeId);
        var messung = Ext.create('Lada.model.Messwert');
        messung.set('probeId', button.probeId);
        messung.set('messungsId', button.parentId);
        var view = Ext.widget('messwertecreate', {model: messung});
    },
    editMesswert: function(grid, record) {
        console.log('Editing Messwert');
        var probe = this.getProbenStore().getById(record.get('probeId'));
        var view = Ext.widget('messwertecreate', {model: record});
        if (probe.get('readonly') === true) {
            var form = view.down('form');
            form.setReadOnly(true);
        }

        console.log("Loaded Messwert with ID " + record.getId()); //outputs ID
    },
    deleteMesswert: function(button) {
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
