/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for functionality that can't be logically put elsewhere.
 */
Ext.define('Lada.controller.Global', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'button[action=about]': {
                click: this.about
            },
            'button[action=toggletimezone]': {
                toggle: this.toggleTimezone
            }
        });
    },

    /**
     * Handle the About action
     */
    about: function() {
        var win = Ext.create('Lada.view.window.About');
        win.show();
    },

    /**
     * Button toggle handler.
     * Toggles timezone
     */
    toggleTimezone: function(button, pressed, opts) {
        Lada.util.Date.setUTCDisplay(pressed);
        //Reload grid to refresh times
        var dynamicGrid = Ext.ComponentQuery.query('dynamicgrid');
        if (dynamicGrid.length > 0) {
            dynamicGrid[0].reload();
        }
    }
});
