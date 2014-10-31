/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Base Controller
 *
 * The controller defines the main logic of the application. It provides
 * various methods which are bound to listeners and called when the defined
 * events in the various UI elements occour (e.g User clicks on a button)
 */
Ext.define('Lada.controller.Base', {
    extend: 'Ext.app.Controller',
    /**
     * Define required views for this controller
     */
    views: [],
    /**
     * Define required stores for this controller
     */
    stores: [],
    /**
     * Define required models for this controller
     */
    models: [],
    init: function() {
        this.addListeners();
    },
    /**
     * Function to add listeners for various events in UI items. The UI Items are selected
     * with a CSS like selector.See ComponentQuery documentation for more
     * details. The function is called while initializing the controller.
     *
     * The function should be overwritten by a specfic implementation.
     */
    addListeners: function() {
        this.control({});
    },
    /**
     * Method to save the kommentar in the database. The method is called when
     * the user clicks on the "Save" button
     */
    saveItem: function(button) {
        console.log('Saving ...');
        var form = button.up('window').down('form');
        form.commit();
    },
    /**
     * Method to open a window to enter the values for a new kommentar.
     * The method is called when the user clicks on the "Add" button in the
     * grid toolbar.
     */
    addItem: function(button) {},
    /**
     * Method to open a window to edit the values for an existing kommentar.
     * The method is called when the user doubleclicks on the item in the
     * grid.
     */
    editItem: function(grid, record) {},
    /**
     * Method to delete a kommentar. This will trigger the display of a
     * Confirmation dialog. After the deletion the related store will be
     * refreshed.
     * The method is called when the user selects the item in the grid and
     * selects the delete button in the grid toolbar.
     */
    deleteItem: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                var store = grid.getStore();
                var deleteUrl = selection.getProxy().url + selection.getId();
                Ext.Ajax.request({
                    url: deleteUrl,
                    method: 'DELETE',
                    success: function(response, opts) {
                        store.reload();
                    }
                });
                console.log('Deleting ' + selection);
            } else {
                console.log('Cancel Deleting ' + selection);
            }
        });
    },
    /**
     * Method to trigger the action after successfull save (create).
     * In this case the related store is refreshed and the window is closed.
     */
    createSuccess: function(form, record, operation) {},
    /**
     * Method to trigger the action after save (create) fails.
     * In this case a Message Boss with a general error is shown.
     */
    createFailure: function(form, record, operation) {
        Ext.MessageBox.show({
            title: 'Fehler beim Speichern',
            msg: form.message,
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.Msg.OK
        });
    },
    /**
     * Method to trigger the action after successfull save (edit).
     * In this case the related store is refreshed and the window is closed.
     */
    editSuccess: function(form, record, operation) {},
    /**
     * Method to trigger the action after save ( edit) fails.
     * In this case a Message Boss with a general error is shown.
     */
    editFailure: function(form, record, operation) {
        Ext.MessageBox.show({
            title: 'Fehler beim Speichern',
            msg: form.message,
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.Msg.OK
        });
    }
});
