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
        'Lada.view.ModeSwitcher',
        'Lada.view.FilterPanel',
        'Lada.view.panel.FilterDetails'
    ],
    layout: 'fit',
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            title: '<center>Labordatenerfassung</center>',
            layout: 'border',
            name: 'main',
            items: [{
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                region: 'west',
                split: true,
                flex: 1,
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype: 'splitbutton',
                        text: 'Info',
                        menu: {
                            items: [{
                                text: i18n.getMsg('about.button.title'),
                                action: 'about'
                            }
                            ]
                        }
                    }, '->', {
                        xtype: 'tbtext',
                        id: 'userinfo',
                        text: ''
                    }, {
                        xtype: 'tbtext',
                        id: 'groupinfo',
                        text: ''
                    }]
                }],
                items: [{
                    xtype: 'modeswitcher',
                    margin: '0, 10, 0, 10'
                }, {
                    // Auswahl einer Abfrage.
                    xtype: 'filterpanel',
                    margin: '0, 10, 0, 10'
                }, {
                // Variables settings for the current selected sql statement.
                    xtype: 'filterdetails',
                    name: 'filterdetails',
                    title: i18n.getMsg('filterdetails.title'),
                    hidden: true,
                    margin: '0, 10, 0, 10'
                }]
            }, {
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
