/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.grid.PKommentar', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'pkommentargrid': {
                edit: this.edit
            },
            'pkommentargrid button[action=add]': {
                click: this.add
            },
            'pkommentargrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    edit: function(editor, context) {
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

    add: function(button) {
        var record = Ext.create('Lada.model.PKommentar');
        record.set('probeId', button.up('pkommentargrid').recordId);
        button.up('pkommentargrid').store.insert(0, record);
        button.up('pkommentargrid').rowEditing.startEdit(0, 1);
    },

    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.destroy({
                    success: function() {
                        button.up('window').initData();
                    },
                    failure: function() {
                        // TODO
                    }
                });
            }
        });
    }
});
