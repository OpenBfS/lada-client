/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.grid.Probenzusatzwert', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'probenzusatzwertgrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit
            },
            'probenzusatzwertgrid button[action=add]': {
                click: this.add
            },
            'probenzusatzwertgrid button[action=delete]': {
                click: this.remove
            }
        });
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

    cancelEdit: function(editor, context) {
        if (!context.record.get('id') ||
            context.record.get('id') === '') {
            editor.getCmp().store.remove(context.record);
        }
    },

    add: function(button) {
        var record = Ext.create('Lada.model.Zusatzwert', {
            probeId: button.up('probenzusatzwertgrid').recordId
        });
        button.up('probenzusatzwertgrid').store.insert(0, record);
        button.up('probenzusatzwertgrid').rowEditing.startEdit(0, 1);
    },

    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Zusatzwert löschen', 'Sind Sie sicher?', function(btn) {
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
