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

    editItem: function(grid, record) {
        var probe = grid.up('window').record;
        var win = Ext.create('Lada.view.window.MessungEdit', {
            parentWindow: grid.up('window'),
            probe: probe,
            record: record,
            grid: grid
        });
        win.show();
        win.initData();
    },

    add: function(button) {
        var probe = button.up('window').record;
        var win = Ext.create('Lada.view.window.MessungCreate', {
            record: probe,
            grid: button.up('messunggrid')
        });
        win.show();
        win.initData();
    },

    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm(
            'Messung löschen',
            'Sind Sie sicher?',
            function(btn) {
                if (btn === 'yes') {
                    selection.destroy({
                        success: function() {
                            button.up('window').initData();
                        },
                        failure: function(request, response) {
                            var json = response.request.scope.reader.jsonData;
                            if (json) {
                                if (json.message){
                                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.delete.title')
                                        +' #'+json.message,
                                        Lada.getApplication().bundle.getMsg(json.message));
                                } else {
                                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.delete.title'),
                                        Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                                }
                            } else {
                                Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.delete.title'),
                                    Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                            }
                        }
                    });
                }
            }
        );
    }
});
