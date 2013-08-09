/**
 * Controller for Kommentare
 *
 * The controller defines the main logic of the application. It provides
 * various methods which are bound to listeners and called when the defined
 * events in the various UI elements occour (e.g User clicks on a button)
 */
Ext.define('Lada.controller.Kommentare', {
    extend: 'Ext.app.Controller',
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
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'kommentarelist': {
                itemdblclick: this.editKommentar
            },
            'kommentarelist toolbar button[action=add]': {
                click: this.addKommentar
            },
            'kommentarelist toolbar button[action=delete]': {
                click: this.deleteKommentar
            },
            'kommentarecreate button[action=save]': {
                click: this.saveKommentar
            },
            'kommentarecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            }
        });
    },
    /**
     * Method to save the kommentar in the database. The method is called when
     * the user clicks on the "Save" button
     */
    saveKommentar: function(button) {
        console.log('Saving Kommentar');
        var form = button.up('window').down('form');
        form.commit();
    },
    /**
     * Method to open a window to enter the values for a new kommentar.
     * The method is called when the user clicks on the "Add" button in the
     * grid toolbar.
     */
    addKommentar: function(button) {
        console.log('Adding new Kommentar for Probe ' + button.probeId);
        var kommentar = Ext.create('Lada.model.Kommentar');
        kommentar.set('probeId', button.probeId);
        var view = Ext.widget('kommentarecreate', {model: kommentar});
    },
    /**
     * Method to open a window to edit the values for an existing kommentar.
     * The method is called when the user doubleclicks on the item in the
     * grid.
     */
    editKommentar: function(grid, record) {
        console.log('Editing Kommentar');
        var view = Ext.widget('kommentarecreate', {model: record});
        console.log("Loaded Kommentar with ID " + record.getId()); //outputs ID
    },
    /**
     * Method to delete a kommentar. This will trigger the display of a
     * Confirmation dialog. After the deletion the related store will be
     * refreshed.
     * The method is called when the user selects the item in the grid and
     * selects the delete button in the grid toolbar.
     */
    deleteKommentar: function(button) {
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
    /**
     * Method to trigger the action after successfull save (create or edit).
     * In this case the related store is refreshed and the window is closed.
     */
    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getKommentareStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },
    /**
     * Method to trigger the action after save (create or edit) fails.
     * In this case a Message Boss with a general error is shown.
     */
    createFailure: function(form, record, operation) {
        Ext.MessageBox.show({
            title: 'Fehler beim Speichern',
            msg: form.message,
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.Msg.OK
        });
    }
});
