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
        'Lada.view.window.Ortszuordnung',
        'Lada.view.form.Ortserstellung'
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
            },
            'ortszuordnungwindow toolbar button[action=createort]':{
                click: this.createort
            },
            'ortszuordnungwindow toolbar button[action=frommap]':{
                click: this.frommap
            },
            'ortszuordnungwindow toolbar button[action=clone]':{
                click: this.cloneort
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
            probe: probe,
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
    },

    /**
     * Opens the form for a new Messpunkt
     */
    createort: function() {
        Ext.create('Lada.view.form.Ortserstellung').show();
    },

    /**
     *
     * Opens the form for a new Messpunkt, with prefilled coordinates.
     * TODO Not functional yet
     */
    frommap: function(button) {
        var map = button.up('ortszuordnungwindow').down('map');
        // map.getClick();
        //TODO: wait for click return
        Ext.create('Lada.view.form.Ortserstellung', {
            presets: {
                kda_id: 4,
                koord_x_extern: 35000000, //TODO dummy values
                koord_y_extern: 1000000
            }
        }).show();
    },

    /**
     * Opens the form for a new Messpunkt, with all values prefilled from the currently
     * selected item
     */
    cloneort: function(button) {
        var grid = button.up('ortszuordnungwindow').down('ortstammdatengrid').getView();
        var selected = grid.getSelectionModel().getSelection()[0];
         Ext.create('Lada.view.form.Ortserstellung', {
             presets: selected.data
        }).show();
    }
});
