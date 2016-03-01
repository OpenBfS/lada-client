/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Orte
 */
Ext.define('Lada.controller.grid.Ortszuordnung', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.window.Ortszuordnung'
    ],

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'ortszuordnunggrid': {
                itemdblclick: this.open
            },
            'ortszuordnunggrid button[action=add]': {
                click: this.add
            },
            'ortszuordnunggrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    /**
     * When open is called, a {@link Lada.view.window.Ortszuordnung}
     * is created which allows to edit the Orte
     */
    open: function(grid, record) {
        var probe = grid.up('window').record;
        var win = Ext.create('Lada.view.window.Ortszuordnung', {
            parentWindow: grid.up('window'),
            probe: grid.up('window').down('probeform').record,
            record: record,
            grid: grid
        });
        win.show();
        win.initData();
    },

    /**
     * This function adds a new row to add an Ort
     */
    add: function(button) {
        var probe = button.up('window').record;
        var win = Ext.create('Lada.view.window.Ortszuordnung', {
            parentWindow: button.up('window'),
            probe: probe,
            record: null,
            grid: button.up('ortszuordnung')
        });
        win.show();
        win.initData();
    },

    /**
     * A Ort-row can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(i18n.getMsg('delete'), i18n.getMsg('confirmation.question'),
                                function(btn) {
                if (btn === 'yes') {
                selection.destroy({
                    success: function() {
                        button.up('window').initData();
                    },
                    failure: function(request, response) {
                        var i18n = Lada.getApplication().bundle;
                        var json = response.request.scope.reader.jsonData;
                        if (json) {
                            if (json.message){
                                Ext.Msg.alert(i18n.getMsg('err.msg.delete.title')
                                    +' #'+json.message,
                                    i18n.getMsg(json.message));
                            } else {
                                Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                    i18n.getMsg('err.msg.generic.body'));
                            }
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                i18n.getMsg('err.msg.response.body'));
                        }
                    }
                });
            }
        });
        grid.down('button[action=delete]').disable();
    }
});
