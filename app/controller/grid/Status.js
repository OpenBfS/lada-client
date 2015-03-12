/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.grid.Status', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'statusgrid': {
                edit: this.gridSave
            },
            'statusgrid button[action=add]': {
                click: this.add
            },
            'statusgrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    gridSave: function(editor, context) {
        context.record.save({
            success: function() {
                context.grid.initData();
                context.grid.up('window').initData();
            },
            failure: function() {
                // TODO
            }
        });
    },

    add: function(button) {
        var record = Ext.create('Lada.model.Status', {
            messungsId: button.up('statusgrid').recordId
        });
        button.up('statusgrid').store.insert(0, record);
        button.up('statusgrid').rowEditing.startEdit(0, 1);
    },

    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Messwert löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.destroy({
                    success: function() {
                        button.up('window').initData();
                        grid.initData();
                    },
                    failure: function() {
                        // TODO
                    }
                });
            }
        });
    }
});
