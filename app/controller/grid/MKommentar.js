/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.grid.MKommentar', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'mkommentargrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit
            },
            'mkommentargrid button[action=add]': {
                click: this.add
            },
            'mkommentargrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    gridSave: function(editor, context) {
        context.record.save({
            success: function(record, response) {
                context.grid.initData();
                context.grid.up('window').initData();
            },
            failure: function(record, response) {
              var json = response.request.scope.reader.jsonData;
              if (json) {
                if (json.message){
                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('errmsgtitle')
                        +' '+json.message,
                        Lada.getApplication().bundle.getMsg(json.message));
                    }
                }
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
        var record = Ext.create('Lada.model.MKommentar');
        record.set('messungsId', button.up('mkommentargrid').recordId);
        button.up('mkommentargrid').store.insert(0, record);
        button.up('mkommentargrid').rowEditing.startEdit(0, 1);
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
