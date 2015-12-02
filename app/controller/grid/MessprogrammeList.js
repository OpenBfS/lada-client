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
                itemdblclick: this.editItem
            },
            'messprogrammelistgrid toolbar button[action=addMessprogramm]': {
                click: this.addMessprogrammItem
            },
            'messprogrammelistgrid toolbar button[action=genProbenFromMessprogramm]': {
                click: this.genProbenFromMessprogramm
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
        var proben = [];
        for (var i = 0; i < selection.length; i++) {
            proben.push(selection[i].get('id'));
        }
        var me = this;

        var winname = 'Lada.view.window.GenProbenFromMessprogramm';
        for (p in proben) {
            grid.setLoading(true);
            Ext.ClassManager.get('Lada.model.Messprogramm').load(proben[p], {
                failure: function(record, action) {
                    me.setLoading(false);
                    // TODO
                    console.log('An unhandled Failure occured. See following Response and Record');
                    console.log(action);
                    console.log(record);
                    },
                success: function(record, response) {
                    grid.setLoading(false);

                    var win = Ext.create(winname, {
                        record: record,
                        parentWindow: null
                    });
                    win.show();
                    win.initData();
                },
                scope: this
            });
        }
    },

    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    }
});

