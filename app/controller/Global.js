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
    toggleTimezone: function(button, utc, opts) {
        Lada.util.Date.setUTCDisplay(utc);
        var i18n = Lada.getApplication().bundle;
        var tztext = utc ? i18n.getMsg('timezone.text.utc') : i18n.getMsg('timezone.text.local');
        button.setText( i18n.getMsg('timezone.button.text') + tztext );
        //Fire event to notify components
        Ext.fireEvent('timezonetoggled', utc);
    }
});
