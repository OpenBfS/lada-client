/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Controller for a Messungengrid
 */
Ext.define('Lada.controller.MessungenGrid', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.window.MessungEdit'
    ],

    init: function() {
        this.control({
            'messungengrid': {
                itemdblclick: this.open
            },
            'messungengrid button[action=add]': {
                click: this.add
            },
            'messungengrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    selectionChanged: function(grid, record) {
        if (record) {
            grid.view.panel.down('button[action=open]').enable();
        }
    },

    gridSave: function(editor, context) {
        context.record.save({
            success: function() {
                context.grid.store.reload();
                context.grid.up('window').initData();
            },
            failure: function() {
                // TODO
            }
        });
    },

    open: function(grid, record) {
        //Opens a detailed view of the Messung
        var win = Ext.create('Lada.view.window.MessungEdit', {
            record: this.record
        });
        win.show();
        win.initData();
        // todo
        console.log('opened window');
    },

    add: function() {
        // todo
        console.log('add');
    },

    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Messung löschen', 'Sind Sie sicher?', function(btn) {
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
