/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for filter result grid.
 */
Ext.define('Lada.controller.grid.MessprogrammeList', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.window.Messprogramm',
        'Lada.view.window.GenProbenFromMessprogramm'
    ],


    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'messprogrammelistgrid': {
                itemdblclick: this.editItem,
                render: this.activateButtons,
                select: this.activateButtons,
                deselect: this.deactivateButtons
            },
            'messprogrammelistgrid toolbar button[action=addMessprogramm]': {
                click: this.addMessprogrammItem
            },
            'messprogrammelistgrid toolbar button[action=genProbenFromMessprogramm]': {
                click: this.genProbenFromMessprogramm,
                // afterrender: this.activateButtons TODO: afterrender is the wrong event
                //TODO event 'as soon as the button is there'
            }
        });
        this.callParent(arguments);
    },

    /**
     * This function is called after a Row in the
     * {@link Lada.view.grid.MessprogrammeList}
     * was double-clicked.
     * The function opens a {@link Lada.view.window.ProbeEdit}
     * or a {@link Lada.view.window.Messprogramm}.
     * To determine which window has to be opened, the function
     * analyse the records modelname.
     */
    editItem: function(grid, record) {
        var winname = 'Lada.view.window.Messprogramm';
        var win = Ext.create(winname, {
            record: record,
            style: 'z-index: -1;' //Fixes an Issue where windows could not be created in IE8
        });
        win.show();
        win.initData();
    },

    /**
     * This function opens a new window to create a Probe
     * {@link Lada.view.window.Messprogramm}
     */
    addMessprogrammItem: function() {
        var win = Ext.create('Lada.view.window.Messprogramm');
        win.show();
        win.initData();
    },

    /**
     * This button creates a window to generate Proben
     * from a selected messprogramm.
     */
    genProbenFromMessprogramm: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        //List of selected Messprogramm items
        var proben = [];
        //List of models of selected Messprogramm items
        var records = [];
        for (var i = 0; i < selection.length; i++) {
            proben.push(selection[i].get('id'));
        }
        var me = this;

        var winname = 'Lada.view.window.GenProbenFromMessprogramm';
        var store = grid.getStore();
        grid.setLoading(true);

        for (p in proben) {
            var record = store.getById(proben[p]);
            records.push(record);
        }
        grid.setLoading(false);
        var win = Ext.create(winname, {
            records: records,
            parentWindow: null
        });
        win.show();
        win.initData();
    },

    /**
     * Toggles the buttons in the toolbar
     **/
    activateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        if (Ext.Array.contains(Lada.funktionen, 4)) {
            var genMessprog = grid.down('button[action=addMessprogramm]');
            if (genMessprog){
                genMessprog.enable();
            }
        }
        if (rowModel.selected && rowModel.selected.length) {
            this.buttonToggle(true, grid);
        }
    },

    /**
     * Toggles the buttons in the toolbar
     **/
    deactivateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        // Only disable buttons when nothing is selected
        if (rowModel.selected.items == 0) {
            this.buttonToggle(false, grid);
        }
        if (!Ext.Array.contains(Lada.funktionen, 4)) {
            var genMessprog = grid.down('button[action=addMessprogramm]');
            if (genMessprog){
                genMessprog.disable();
            }
        }
    },

    /**
     * Enables/Disables a set of buttons
     **/
    buttonToggle: function(enabled, grid) {
        if (!enabled) {
            grid.down('button[action=genProbenFromMessprogramm]').disable();
        } else {
            grid.down('button[action=genProbenFromMessprogramm]').enable();
        }
    }
});

