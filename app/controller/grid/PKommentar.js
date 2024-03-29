/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Pkommentare
 */
Ext.define('Lada.controller.grid.PKommentar', {
    extend: 'Lada.controller.grid.BaseGridController',
    alias: 'controller.pkommentargrid',

    /**
     * Initialize the Controller with
     * 3 Listeners
     */
    init: function() {
        this.control({
            'pkommentargrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit
            },
            'pkommentargrid button[action=add]': {
                click: this.add
            },
            'pkommentargrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    /**
     * This function is called when the grids roweditor saves
     * the record.
     * On success it refreshes the windows which contains the grid
     * On failure it displays a message
     */
    gridSave: function(editor, context) {
        context.record.set('date', new Date());
        if (context.record.phantom) {
            context.record.set('id', null);
        }
        context.record.save({
            scope: this,
            success: function() {
                context.grid.getSelectionModel().clearSelections();
                context.grid.up('window').initData();
            },
            failure: function(record, response) {
                this.handleSaveFailure(record, response, context.record);
            }
        });
    },

    /**
     * When the edit was canceled,
     * the empty row might have been created by the roweditor is removed
     */
    cancelEdit: function(editor, context) {
        if (context.record.phantom) {
            editor.getCmp().store.remove(context.record);
        }
    },

    /**
     * This function adds a new row to add a PKommentar
     */
    add: function(button) {
        var record = Ext.create('Lada.model.CommSample', {
            sampleId: button.up('pkommentargrid').getParentRecordId()
        });
        record.data.date = Lada.util.Date.formatTimestamp(new Date(),
            'd.m.Y H:i', true);
        button.up('pkommentargrid').store.insert(0, record);
        button.up('pkommentargrid').rowEditing.startEdit(0, 1);
    },

    /**
     * A PKommentar-row can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.erase({
                    success: function() {
                        button.up('window').initData();
                    },
                    failure: function(request, response) {
                        var i18n = Lada.getApplication().bundle;
                        if (response.error) {
                            //TODO: check content of html error code
                            Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        } else {
                            var json = Ext.decode(
                                response.getResponse().responseText);
                            if (json) {
                                if (json.message) {
                                    Ext.Msg.alert(i18n.getMsg(
                                        'err.msg.delete.title')
                                    + ' #' + json.message,
                                    i18n.getMsg(json.message));
                                } else {
                                    Ext.Msg.alert(i18n.getMsg(
                                        'err.msg.delete.title'),
                                    i18n.getMsg('err.msg.generic.body'));
                                }
                            } else {
                                Ext.Msg.alert(i18n.getMsg(
                                    'err.msg.delete.title'),
                                i18n.getMsg('err.msg.response.body'));
                            }
                        }
                    }
                });
            }
        });
        grid.down('button[action=delete]').disable();
    }
});
