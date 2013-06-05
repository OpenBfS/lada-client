Ext.define('Lada.controller.Proben', {
    extend: 'Ext.app.Controller',
    views: [
        'proben.List',
        'proben.Edit',
        'proben.Create'
    ],
    stores: [
        'Proben',
        'Uwb',
        'Datenbasis',
        'Probenart',
        'Betriebsart',
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
        console.log('Adding new Probe 1');
        var view = Ext.widget('probencreate');
    },
    editProbe: function(grid, record) {
        console.log('Double click on ' + record.get('probeId'));
        // Create new window to edit the seletced record.
        var view = Ext.widget('probenedit');
        var form = view.down('form');
        form.loadRecord(record);

        // Load kommentare
        var kommentare = form.down('kommentarelist'); //form.down('kommentare');
        var kstore = kommentare.getStore();
        kstore.load({
            params: {
                probe: record.data['probeId']
            }
        });

        // Set form data
        console.log("Loaded probe with ID " + record.getId()); //outputs ID
    },
    createSuccess: function(form, record, operation) {
        var win = form.up('window');
        win.close();
    },
    createFailure: function(form, record, operation) {
        Ext.MessageBox.show({
            title: 'Fehler beim Speichern',
            msg: 'Es gab Fehler beim Anlegen der Probe',
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.Msg.OK
        });
    },
    editSuccess: function(form, record, operation) {
        var win = form.up('window');
        win.close();
    },
    editFailure: function(form, record, operation) {
        Ext.MessageBox.show({
            title: 'Fehler beim Speichern',
            msg: 'Es gab Fehler beim Speichern der Probe',
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.Msg.OK
        });
    }
});
