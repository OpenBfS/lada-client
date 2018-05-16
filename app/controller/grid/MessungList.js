/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the Messung items in search result grid.
 */
Ext.define('Lada.controller.grid.MessungList', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.window.SetStatus'
    ],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'dynamicgrid toolbar button[action=setstatus]': {
                click: this.setStatus
            }
        });
        this.callParent(arguments);
    },

    /**
     * Sets the Status on Bulk
     **/
    setStatus: function(button) {

        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;

        var win = Ext.create('Lada.view.window.SetStatus', {
            title: i18n.getMsg('statusSetzen.win.title'),
            grid: grid,
            modal: true,
            selection: selection
        });

        win.show();
    }
});
