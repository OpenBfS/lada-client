/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * About Window with basic information.
 */
Ext.define('Lada.view.window.About', {
    extend: 'Ext.window.Window',

    layout: 'fit',

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            }
        });

        this.title = i18n.getMsg('about.window.title');
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.items = [{
            border: false,
            autoscroll: 'true',
            items: [{
                xtype: 'panel',
                border: false,
                layout: 'fit',
                bodyPadding: 20,
                html: '<p>'
                    + i18n.getMsg('about.window.text.login')
                    + '<br /><b>'
                    + Lada.username
                    + '</b></p>'
                    + '<p>'
                    + i18n.getMsg('about.window.text.roles')
                    + this.rolesToHtml()
                    + '</p>'
                    + '<p>'
                    + i18n.getMsg('about.window.text.logintime')
                    + '<br />'
                    + Ext.Date.format(new Date(Lada.logintime), 'd.m.y h:i:s P')
                    + '</p>'
                    + '<p>'
                    + i18n.getMsg('about.window.text.serverversion')+ ' '
                    + Lada.serverVersion
                    + '</p>'
                    + '<p>'
                    + i18n.getMsg('about.window.text.clientversion')+' '
                    + Lada.clientVersion
                    + '</p>'
            }]
        }];

        this.callParent(arguments);
    },

    /**
     * This function converts an Array into HTML-paragraphs
     */
    rolesToHtml: function() {
        var roles = '';
        //        var r = Lada.userroles.split(',');
        var i;
        for (i in Lada.userroles) {
            roles += '<br />' + Lada.userroles[i];
        }
        return roles;
    }
});
