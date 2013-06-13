Ext.define('Lada.controller.Proben', {
    extend: 'Ext.app.Controller',
    views: [
        'proben.List',
        'proben.Edit',
        'proben.Create'
    ],
    stores: [
        'Proben',
        'Orte',
        'Uwb',
        'Datenbasis',
        'Probenart',
        'Betriebsart',
        'Netzbetreiber',
        'Testdatensatz'
    ],
    models: [
        'Probe'
    ],
    init: function() {
        console.log('Initialising the Proben controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'probenlist': {
                itemdblclick: this.editProbe
            },
            'probenlist toolbar button[action=add]': {
                click: this.addProbe
            },
            'probencreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'probenedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },
    addProbe: function(button) {
        console.log('Adding new Probe');
        var view = Ext.widget('probencreate');
    },
    editProbe: function(grid, record) {
        console.log('Editing Probe');
        var id = record.get('probeId');
        var view = Ext.widget('probenedit', {modelId: id});
        console.log("Loaded Probe with ID " + record.getId()); //outputs ID
    },
    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getProbenStore();
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
        var store = this.getProbenStore();
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
