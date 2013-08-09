/**
 * Controller for Kommentare
 */
Ext.define('Lada.controller.Kommentare', {
    extend: 'Lada.controller.Base',
    views: [
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
        this.callParent();
    },
    addListeners: function() {
        this.control({
            'kommentarelist': {
                itemdblclick: this.editItem
            },
            'kommentarelist toolbar button[action=add]': {
                click: this.addItem
            },
            'kommentarelist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'kommentarecreate button[action=save]': {
                click: this.saveItem
            },
            'kommentarecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            }
        });
    },
    addItem: function(button) {
        console.log('Adding new Kommentar for Probe ' + button.probeId);
        var kommentar = Ext.create('Lada.model.Kommentar');
        kommentar.set('probeId', button.probeId);
        var view = Ext.widget('kommentarecreate', {model: kommentar});
    },
    editItem: function(grid, record) {
        console.log('Editing Kommentar');
        var view = Ext.widget('kommentarecreate', {model: record});
        console.log("Loaded Kommentar with ID " + record.getId()); //outputs ID
    },
    createSuccess: function(form, record, operation) {
        var store = this.getKommentareStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
