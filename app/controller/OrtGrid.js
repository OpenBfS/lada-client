/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.OrtGrid', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'ortgrid': {
                selectionchange: this.selectionChanged,
                edit: this.gridSave
            },
            'ortgrid button[action=open]': {
                click: this.open
            },
            'ortgrid button[action=add]': {
                click: this.add
            },
            'ortgrid button[action=delete]': {
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

    open: function() {
        // todo
        console.log('open');
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
