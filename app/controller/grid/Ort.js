/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.grid.Ort', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.window.OrtEdit'
    ],

    init: function() {
        this.control({
            'ortgrid': {
                itemdblclick: this.open
            },
            'ortgrid button[action=add]': {
                click: this.add
            },
            'ortgrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    open: function(grid, record) {
        var win = Ext.create('Lada.view.window.OrtEdit', {
            record: record
        });
        win.show();
        win.initData();
    },

    add: function() {
        // todo
        console.log('add');
    },

    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Ortsangabe löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.destroy({
                    success: function() {
                        button.up('window').initData();
                    },
                    failure: function() {
                    }
                });
            }
        });
    }
});
