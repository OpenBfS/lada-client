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
            'button[action=logout]': {
                click: this.logout
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

    logout: function() {
        var i18n = Lada.getApplication().bundle;
        Ext.Ajax.setUseDefaultXhrHeader(false);
        Ext.Ajax.setWithCredentials(true);
        Ext.Ajax.request({
            url: '/Shibboleth.sso/Logout',
            success: function (response) {
                window.removeEventListener('beforeunload', Lada.getApplication().beforeCloseHandler);
                window.location.reload();
            },
            failure: function (response) {
                Ext.Msg.alert(i18n.getMsg('err.msg.slo.failed.title'), i18n.getMsg('err.msg.slo.failed.body'));
            }
        });
    }
});
