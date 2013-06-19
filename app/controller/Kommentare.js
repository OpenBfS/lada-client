Ext.define('Lada.controller.Kommentare', {
    extend: 'Ext.app.Controller',
    views: [
        'kommentare.List',
        'kommentare.Edit',
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
                // Map Doubleclick on rows of the probenlist.
                itemdblclick: this.editKommentar
            },
            'kommentarelist toolbar button[action=add]': {
                click: this.addKommentar
            },
            'kommentarelist toolbar button[action=delete]': {
                click: this.deleteKommentar
            },
            'kommentaredit button[action=save]': {
                click: this.saveKommentar
            }
        });
    },
    addKommentar: function(button) {
        console.log('Adding new Kommentar');
        var view = Ext.create('Lada.view.kommentare.Create');
        var form = view.down('form');
        // Set probeId
        var probenform = button.up('form');
        var probe = probenform.getRecord();
        var probeId = probe.get('probeId');
        form.model.set('probeId', probeId);
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
    editKommentar: function(grid, record) {
        // Create new window to edit the seletced record.
        var view = Ext.widget('kommentaredit');
        var form = view.down('form');
        form.loadRecord(record);
    },
    saveKommentar: function(button) {
        var win = button.up('window');
        var form = win.down('form');
        var record = form.getRecord();
        var values = form.getValues();
        var store = this.getKommentareStore();
        record.set(values);
        store.add(record);
        store.sync();
        console.log('Saving Kommentar');
        win.close();
    }
});
