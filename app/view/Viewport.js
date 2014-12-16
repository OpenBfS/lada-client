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
        'Lada.store.Info',
        'Lada.view.search.List',
        'Lada.view.proben.List'
    ],
    layout: 'fit',
    initComponent: function() {
        this.initSearch();

        // Development related:
        // Disable "initSearch" call and enable one of the following init
        // methods to get a dialog directly without the need to click through
        // the whole application.
        // this.initProbe();
        // this.initOrt();
        // this.initMessung();
        // this.initMesswert();

        this.setInfo();
        this.callParent(arguments);
    },
    /**
     * Set some information about user, client and server version in the top
     * of the application window. The data will be fetched from the server.
     */
    setInfo: function() {
        var store = Ext.create('Lada.store.Info');
        store.load({
            callback: function() {
                var info = store.data.items[0];
                var user = info.get('user');
                var groups = info.get('groups');
                var groupinfo = Ext.getCmp('groupinfo');
                var userinfo = Ext.getCmp('userinfo');
                userinfo.update(user);
                groupinfo.update(groups);
            }
        });
    },
    /**
     * Function to initialize the edit window for a particular probe directly
     * @private
     */
    initProbe: function() {
        var store = Ext.getStore('Proben');
        store.load({
            params: {
                probeId: '000007575943X'
            },
            callback: function() {
                var mstore = Ext.getStore('Messungen');
                mstore.load({
                    params: {
                        probeId: '000007575943X'
                    }
                });
                var model = store.data.items[0];
                Ext.create('Lada.view.proben.Edit', {
                    model: model
                });
            }
        });
    },
    /**
     * Function to initialize the edit window for a priticular messwert directly
     * @private
     */
    initMesswert: function() {
        var store = Ext.getStore('Messwerte');
        store.load({
            params: {
                probeId: '000007575853X',
                messungsId: '1'
            },
            callback: function() {
                var model = store.data.items[0];
                Ext.create('Lada.view.messwerte.Create', {
                    model: model
                });
            }
        });
    },
    /**
     * Function to initialize the edit window for a priticular ort directly
     * @private
     */
    initOrt: function() {
        var ort = Ext.create('Lada.model.Ort');
        Ext.create('Lada.view.orte.Create', {
            model: ort
        });
    },
    /**
     * Function to initialize the edit window for a priticular ort directly
     * @private
     */
    initMessung: function() {
        var store = Ext.getStore('Messungen');
        var kstore = Ext.getStore('KommentareM');
        var mstore = Ext.getStore('Messwerte');
        var sstore = Ext.getStore('Status');
        var probeId = '000007578314X';
        store.load({
            params: {
                probeId: probeId
            },
            callback: function() {
                var messung = store.data.items[0];
                kstore.load({
                    params: {
                        probeId: probeId,
                        messungsId: messung.get('id').messungsId
                    }
                });
                sstore.load({
                    params: {
                        probeId: probeId,
                        messungsId: messung.get('id').messungsId
                    }
                });
                mstore.load({
                    params: {
                        probeId: probeId,
                        messungsId: messung.get('id').messungsId
                    }
                });
                // var messung = Ext.create('Lada.model.Messung');
                Ext.create('Lada.view.messungen.Create', {
                    model: messung
                });
            }
        });
    },
    /**
     * Function to initialize the search window. This is the default method
     * called by the {@link Lada.view.Viewport#initComponent initComponent}
     * method.
     * @private
     */
    initSearch: function() {
        this.items = [{
            title: '<center>Probenauswahlmaske</center>',
            layout: 'border',
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
                                id: 'AboutBtn',
                                text: 'About'
                            }]
                        }
                    }, '->', {
                        xtype: 'box',
                        autoEl: {
                            tag: 'img',
                            src: 'gfx/user-identity.png'
                        }
                    }, {
                        xtype: 'tbtext',
                        id: 'userinfo',
                        text: ''
                    }, {
                        xtype: 'box',
                        autoEl: {
                            tag: 'img',
                            src: 'gfx/network-workgroup.png'
                        }
                    }, {
                        xtype: 'tbtext',
                        id: 'groupinfo',
                        text: ''
                    }]
                }],
                items: [{
                    // Auswahl einer Abfrage.
                    xtype: 'queryselector',
                    margin: '0, 10, 0, 10',
                    id: 'queryselector'
                }, {
                // Variables settings for the current selected sql statement.
                    xtype: 'fieldset',
                    id: 'queryfilters',
                    title: 'Variablenbelegung',
                    hidden: true,
                    margin: '0, 10, 0, 10',
                    items: []
                }]
            }, {
            // Resultlist for the query.
                id: 'result',
                flex: 3,
                xtype: 'probenlist',
                hidden: false,
                region: 'center'
            }]
        }];
    }
});
