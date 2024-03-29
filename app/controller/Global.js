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
    routes: {
        'importer': 'onLafImport'
    },

    init: function() {
        this.control({
            'button[action=about]': {
                click: this.about
            },
            'button[action=logout]': {
                click: this.logout
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

    logout: function() {
        var i18n = Lada.getApplication().bundle;
        Ext.Ajax.setUseDefaultXhrHeader(false);
        Ext.Ajax.setWithCredentials(true);
        Ext.Ajax.request({
            url: '/Shibboleth.sso/Logout',
            success: function() {
                window.removeEventListener(
                    'beforeunload', Lada.getApplication().beforeCloseHandler);
                window.location.reload();
            },
            failure: function() {
                Ext.Msg.alert(
                    i18n.getMsg('err.msg.slo.failed.title'),
                    i18n.getMsg('err.msg.slo.failed.body'));
            }
        });
    },

    /**
     * Button toggle handler.
     * Toggles timezone
     */
    toggleTimezone: function(button, utc) {
        Lada.util.Date.setUTCDisplay(utc);
        var i18n = Lada.getApplication().bundle;
        var tztext = utc ?
            i18n.getMsg('timezone.text.utc') :
            i18n.getMsg('timezone.text.local');
        button.setText( i18n.getMsg('timezone.button.text') + tztext );
        //Get components that need a reload
        var dynamicgrids = Ext.ComponentQuery.query('dynamicgrid');
        var auditrails = Ext.ComponentQuery.query('audittrail');
        var componentsToWaitFor = dynamicgrids.length + auditrails.length;
        if (componentsToWaitFor !== 0) {
            button.startToggle(componentsToWaitFor);
        }
        //Fire event to notify components
        Ext.fireEvent('timezonetoggled', utc);
    },

    onLafImport: function() {
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        if (viewport) {
            viewport.down('tabpanel').setActiveTab(1);
        }
    }
});
