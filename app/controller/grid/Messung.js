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
Ext.define('Lada.controller.grid.Messung', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.window.MessungEdit'
    ],

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'messunggrid': {
                itemdblclick: this.editItem
            },
            'messunggrid button[action=add]': {
                click: this.add
            },
            'messunggrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    /**
     * This function opens a new {@link Lada.view.window.MessungEdit}
     * Window.
     */
    editItem: function(grid, record) {
        if (grid.ignoreNextDblClick === true) {
            grid.ignoreNextDblClick = false;
            return;
        }
        var probeLoadCallBack = function(
            probeWindow,
            probeRecord,
            messungRecord
        ) {
            var win = Ext.create('Lada.view.window.MessungEdit', {
                parentWindow: probeWindow,
                probe: probeRecord,
                record: messungRecord
            });
            win.initData();
            win.show();
            probeWindow.addChild(win);
            if (win.isVisible()) {
                win.setPosition(window.innerWidth - 30 - win.width);
            }

            return;
        };
        if (grid.up('probenedit')) {
            probeLoadCallBack(
                grid.up('probenedit'),
                grid.up('probenedit').record,
                record);
        } else {
            Lada.model.Sample.load(record.get('probeId'), {
                success: function(precord) {
                    var probeWin = Ext.create('Lada.view.window.ProbeEdit', {
                        record: precord,
                        style: 'z-index: -1;'
                    });
                    probeWin.initData();
                    probeWin.show();
                    probeWin.setPosition(30);
                    probeLoadCallBack(probeWin, precord, record);
                }
            });
        }
    },

    /**
     * This function opens a window add a Messung
     */
    add: function(button) {
        var probe = button.up('window').record;
        var win = Ext.create('Lada.view.window.MessungCreate', {
            record: probe,
            grid: button.up('messunggrid'),
            parentWindow: button.up('window')
        });
        win.initData();
        win.show();
        win.setPosition(window.innerWidth - 30 - win.width);
    },

    /**
     * This function removes a Messung
     * It displays a Confirmation-Popup.
     * When the Removal was confirmed and the operation was successful,
     * the Messung-row is removed from the grid.
     * On failure an Errormessage is shown
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm(
            'Messung löschen',
            'Sind Sie sicher?',
            function(btn) {
                if (btn === 'yes') {
                    selection.erase({
                        success: function() {
                            button.up('window').initData();
                            var parentGrid = Ext.ComponentQuery.query(
                                'dynamicgrid');
                            if (parentGrid.length === 1) {
                                parentGrid[0].reload();
                            }
                        },
                        failure: function(request, response) {
                            var i18n = Lada.getApplication().bundle;
                            if (response.error) {
                                Ext.Msg.alert(i18n.getMsg(
                                    'err.msg.delete.title'),
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
                                        i18n.getMsg(
                                            'err.msg.generic.body'));
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
            }
        );
        grid.down('button[action=delete]').disable();
    }
});
