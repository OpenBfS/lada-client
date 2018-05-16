/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for Messprogramme items in search result grids
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
            'dynamicgrid toolbar button[action=addMessprogramm]': {
                click: this.addMessprogrammItem
            },
            'dynamicgrid toolbar button[action=genProbenFromMessprogramm]': {
                click: this.genProbenFromMessprogramm
            }
        });
        this.callParent(arguments);
    },

    /**
     * This function opens a new window to create a Messprogramm
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
        //List of selected Messprogramm items
        var proben = [];
        //List of models of selected Messprogramm items
        var records = [];
        for (var i = 0; i < selection.length; i++) {
            proben.push(selection[i].get('id'));
        }

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
    }
});

