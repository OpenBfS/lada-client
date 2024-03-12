/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Probenzusatzwert
 */
Ext.define('Lada.controller.grid.Probenzusatzwert', {
    extend: 'Lada.controller.grid.BaseGridController',
    alias: 'controller.probenzusatzwertgrid',

    /**
     * Initialize the Controller with
     * 4 Listeners
     */
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
            },
            'probenzusatzwertgrid combobox[name=beschreibung]': {
                select: this.select
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
     * This function adds a new row to add a Probenzusatzwert
     */
    add: function(button) {
        var record = Ext.create('Lada.model.SampleSpecifMeasVal', {
            sampleId: button.up('probenzusatzwertgrid').getParentRecordId()
        });
        //Remove generated id id to prevent sending invalid ids to the server
        record.set('id', null);
        button.up('probenzusatzwertgrid').store.insert(0, record);
        button.up('probenzusatzwertgrid').rowEditing.startEdit(0, 1);
    },

    /**
     * A row can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(
            i18n.getMsg('delete.zusatzwert'),
            i18n.getMsg('confirmation.question'),
            function(btn) {
                if (btn === 'yes') {
                    selection.erase({
                        success: function() {
                            button.up('window').initData();
                        },
                        failure: function(request, response) {
                            var json = response.request.scope.reader.jsonData;
                            if (json) {
                                if (json.message) {
                                    Ext.Msg.alert(
                                        i18n.getMsg('err.msg.delete.title')
                                            + ' #'
                                            + json.message,
                                        i18n.getMsg(json.message));
                                } else {
                                    Ext.Msg.alert(
                                        i18n.getMsg('err.msg.delete.title'),
                                        i18n.getMsg('err.msg.generic.body'));
                                }
                            } else {
                                Ext.Msg.alert(
                                    i18n.getMsg('err.msg.delete.title'),
                                    i18n.getMsg('err.msg.response.body'));
                            }
                        }
                    });
                }
            });
        grid.down('button[action=delete]').disable();
    },

    select: function(editor, record) {
        editor.up().down('selectabledisplayfield').setValue(record.get('id'));
        var mehid = Ext.data.StoreManager.get('messeinheiten').findRecord(
            'id', record.get('measUnitId'), 0, false, false, true);
        if (!mehid) {
            editor.up().getRefItems()[4].setValue('');
        } else {
            editor.up().getRefItems()[4].setValue(mehid.get('unitSymbol'));
        }
    }
});
