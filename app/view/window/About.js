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
    constrain: true,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            },
            show: function() {
                this.removeCls("x-unselectable");
            }
        });

        var i18n = Lada.getApplication().bundle;
        this.setTitle = i18n.getMsg('about.window.title');
        this.items = [{
            border: false,
            autoscroll: 'true',
            items: [{
                xtype: 'panel',
                name: 'aboutcontent',
                border: false,
                layout: 'fit',
                bodyPadding: 20,
                html: this.updateContent()
            }]
        }];
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.callParent(arguments);
        var me = this;

        Ext.on('timezonetoggled', function(utc) {
            me.down('panel[name=aboutcontent]').setHtml(me.updateContent());
        });
    },

    updateContent: function() {
        var i18n = Lada.getApplication().bundle;
        return  '<p>'
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
                + Lada.util.Date.formatTimestamp(Lada.logintime, 'd.m.y h:i:s P', true)
                + '</p>'
                + '<p>'
                + i18n.getMsg('about.window.text.serverversion')+ ' '
                + Lada.serverVersion
                + '</p>'
                + '<p>'
                + i18n.getMsg('about.window.text.clientversion')+' '
                + Lada.clientVersion
                + '</p>';
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
