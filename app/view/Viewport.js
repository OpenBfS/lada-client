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
 * debugging it is possible to initialize other components directly see the
 * initComponent function.
 */
Ext.define('Lada.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Lada.view.FilterPanel',
        'Lada.view.grid.FilterResult'
    ],
    layout: 'fit',
    initComponent: function() {
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
                border: 1,
                flex: 1,
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype: 'splitbutton',
                        text: 'Info',
                        menu: {
                            items: [{
                                text: 'About',
                                action: 'about'
                            }, {
                                text: 'Zeit',
                                handler: function(){
                                    thetime = new Date();
                                    Ext.Msg.alert("Zeit", "Laut Ihrer lokalen Systemuhr ist es\n"+
                                            thetime.toString() + "\n\n" +
                                          "Das entspricht der Serverzeit:\n" +
                                            thetime.toUTCString() + "\n\n" +
                                          "Alle Messwerte werden in GMT/UTC auf dem Server gespeichert. " + 
                                          "Ihr Webbrowser rechnet diese automatisch um."
                                         );
                                }
                            }
                            ]
                        }
                    }, '->', {
                        xtype: 'box',
                        autoEl: {
                            tag: 'img',
                            src: 'resources/img/user-identity.png'
                        }
                    }, {
                        xtype: 'tbtext',
                        id: 'userinfo',
                        text: ''
                    }, {
                        xtype: 'box',
                        autoEl: {
                            tag: 'img',
                            src: 'resources/img/network-workgroup.png'
                        }
                    }, {
                        xtype: 'tbtext',
                        id: 'groupinfo',
                        text: ''
                    }]
                }],
                items: [{
                    // Auswahl einer Abfrage.
                    xtype: 'filterpanel',
                    margin: '0, 10, 0, 10'
                }, {
                // Variables settings for the current selected sql statement.
                    xtype: 'fieldset',
                    name: 'filtervariables',
                    title: 'Variablenbelegung',
                    hidden: true,
                    margin: '0, 10, 0, 10',
                    items: []
                }]
            }, {
            // Resultlist for the query.
                flex: 3,
                xtype: 'filterresultgrid',
                hidden: false,
                region: 'center'
            }]
        }];
        this.callParent(arguments);
    }
});
