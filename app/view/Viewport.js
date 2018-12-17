/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Viewport for the Lada-Client
 *
 * The viewport initialises the graphical elements of the application. For
 * debugging it is possible to initialise other components directly see the
 * initComponent function.
 */
Ext.define('Lada.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Lada.view.QueryPanel'
    ],
    layout: 'fit',
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            title: i18n.getMsg('title.viewport'),
            layout: 'border',
            name: 'main',
            tools: [{
                type: 'help',
                tooltip: i18n.getMsg('help.qtip'),
                callback: function() {
                    var imprintWin = Ext.ComponentQuery.query('k-window-imprint')[0];
                    if (!imprintWin) {
                        imprintWin = Ext.create('Lada.view.window.HelpprintWindow').show();
                        imprintWin.on('afterlayout', function() {
                            var imprintWinController = this.getController();
                            imprintWinController.setTopic('intro');
                        }, imprintWin, {single: true});
                    } else {
                        // BasiGX.util.Animate.shake(imprintWin);
                        var imprintWinController = imprintWin.getController();
                        imprintWinController.shake(imprintWin);
                        imprintWinController.setTopic('intro');
                    }
                }
            }],
            items: [{
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                tools: [{
                    type: 'help',
                    tooltip: i18n.getMsg('help.qtip'),
                    callback: function() {
                        var imprintWin = Ext.ComponentQuery.query('k-window-imprint')[0];
                        if (!imprintWin) {
                            imprintWin = Ext.create('Lada.view.window.HelpprintWindow').show();
                            imprintWin.on('afterlayout', function() {
                                var imprintWinController = this.getController();
                                imprintWinController.setTopic('query');
                            }, imprintWin, {single: true});
                        } else {
                            var imprintWinController = imprintWin.getController();
                            imprintWinController.shake(imprintWin);
                            imprintWinController.setTopic('query');
                        }
                    }
                }],
                region: 'west',
                split: true,
                flex: 1,
                collapsible: true,
                minWidth: 500,
                collapsed: false,
                layout: 'fit',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype: 'button',
                        text: i18n.getMsg('info'),
                        action: 'about'
                    }, '->', {
                        xtype: 'tbtext',
                        id: 'userinfo',
                        text: i18n.getMsg('userinfo.user') + ' ' + Lada.username
                    }]
                }],
                items: [{
                    xtype: 'querypanel',
                    margin: 0,
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [{
                            xtype: 'button',
                            action: 'search',
                            name: 'search',
                            icon: 'resources/img/Find.png',
                            margin: '0 15 0 15',
                            disabled: true,
                            flex: 1
                        }]
                    }]
                }]
            },{
                xtype: 'panel',
                layout: 'fit',
                name: 'contentpanel',
                flex: 3,
                hidden: false,
                region: 'center'
            }]
        }];
        this.callParent(arguments);
    }
});
