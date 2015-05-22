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

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            }
        });

        var me = this;
        this.title = i18n.getMsg('about.window.title');
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.items = [{
            border: 0,
            autoscroll: 'true',
            layout: 'vbox',
            items: [{
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: i18n.getMsg('about.window.text.login')
            }, {
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: Lada.username
            }, {
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: i18n.getMsg('about.window.text.roles')
            }, {
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: Lada.userroles
            }, {
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: i18n.getMsg('about.window.text.logintime')
            }, {
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: Ext.Date.format(new Date(Lada.logintime), 'd.m.Y H:i:s P')
            }, {
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: i18n.getMsg('about.window.text.serverversion')
            }, {
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: Lada.serverversion
            }, {
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: i18n.getMsg('about.window.text.clientversion')
            }, {
                xtype: 'text',
                style: {
                    width: '95%',
                    marginBottom: '5px'
                },
                text: Lada.clientversion
            }]
        }];

        this.callParent(arguments);
    }
});
