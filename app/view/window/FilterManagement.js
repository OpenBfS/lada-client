/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 *
 */
Ext.define('Lada.view.window.FilterManagement', {
    extend: 'Ext.window.Window',
    alias: 'widget.filtermanagement',

    requires: [
        'Lada.view.widget.base.FavColumn'
    ],

    layout: 'fit',
    width: window.innerWidth - 100,
    height: 500,
    closeAction: 'hide',

    /**
     * @private
     * Initialize the view.
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        var probenstore = Ext.StoreManager.get('probequeries');
        var messungstore = Ext.StoreManager.get('messungqueries');
        var messpstore = Ext.StoreManager.get('messprogrammqueries');
        var stammstore = Ext.StoreManager.get('stammdatenqueries');
        me.items = [{
            xtype: 'tabpanel',
            items: [{
                title: i18n.getMsg('querygrid.probe.title'),
                xtype: 'grid',
                viewConfig: {
                    markDirty: false,
                    getRowClass: function() {
                        return 'x-lada-multiline-grid';
                    }
                },
                store: probenstore,
                columns: [{
                    header: i18n.getMsg('querygrid.header.favorite'),
                    width: 48,
                    dataIndex: 'favorite',
                    xtype: 'favcolumn'
                }, {
                    header: i18n.getMsg('querygrid.header.name'),
                    dataIndex: 'name',
                    width: 200
                }, {
                    header: i18n.getMsg('querygrid.header.description'),
                    dataIndex: 'description',
                    minWidth: 200,
                    flex: 3
                }, {
                    header: i18n.getMsg('querygrid.header.columns'),
                    dataIndex: 'results',
                    width: 250,
                    flex: 2,
                    renderer: function(value) {
                        var columnString = [];
                        for (var i = 0; i < value.length; i++) {
                            columnString.push(value[i].header);
                        }
                        return columnString.join(', ');
                    }
                }, {
                    header: i18n.getMsg('querygrid.header.filters'),
                    dataIndex: 'filters',
                    width: 200,
                    renderer: function(value) {
                        var columnString = [];
                        for (var i = 0; i < value.length; i++) {
                            columnString.push(value[i].label);
                        }
                        return columnString.join(', ');
                    }
                }]
            }, {
                title: i18n.getMsg('querygrid.messung.title'),
                xtype: 'grid',
                viewConfig: {
                    markDirty: false,
                    getRowClass: function() {
                        return 'x-lada-multiline-grid';
                    }
                },
                store: messungstore,
                columns: [{
                    header: i18n.getMsg('querygrid.header.favorite'),
                    width: 48,
                    dataIndex: 'favorite',
                    xtype: 'favcolumn'
                }, {
                    header: i18n.getMsg('querygrid.header.name'),
                    dataIndex: 'name',
                    width: 200
                }, {
                    header: i18n.getMsg('querygrid.header.description'),
                    dataIndex: 'description',
                    minWidth: 200,
                    flex: 3
                }, {
                    header: i18n.getMsg('querygrid.header.columns'),
                    dataIndex: 'results',
                    width: 250,
                    flex: 2,
                    renderer: function(value) {
                        var columnString = [];
                        for (var i = 0; i < value.length; i++) {
                            columnString.push(value[i].header);
                        }
                        return columnString.join(', ');
                    }
                }, {
                    header: i18n.getMsg('querygrid.header.filters'),
                    dataIndex: 'filters',
                    width: 200,
                    renderer: function(value) {
                        var columnString = [];
                        for (var i = 0; i < value.length; i++) {
                            columnString.push(value[i].label);
                        }
                        return columnString.join(', ');
                    }
                }]
            }, {
                title: i18n.getMsg('querygrid.messprogramm.title'),
                xtype: 'grid',
                viewConfig: {
                    markDirty: false,
                    getRowClass: function() {
                        return 'x-lada-multiline-grid';
                    }
                },
                store: messpstore,
                columns: [{
                    header: i18n.getMsg('querygrid.header.favorite'),
                    width: 48,
                    dataIndex: 'favorite',
                    xtype: 'favcolumn'
                }, {
                    header: i18n.getMsg('querygrid.header.name'),
                    dataIndex: 'name',
                    width: 200
                }, {
                    header: i18n.getMsg('querygrid.header.description'),
                    dataIndex: 'description',
                    minWidth: 200,
                    flex: 3
                }, {
                    header: i18n.getMsg('querygrid.header.columns'),
                    dataIndex: 'results',
                    width: 250,
                    flex: 2,
                    renderer: function(value) {
                        var columnString = [];
                        for (var i = 0; i < value.length; i++) {
                            columnString.push(value[i].header);
                        }
                        return columnString.join(', ');
                    }
                }, {
                    header: i18n.getMsg('querygrid.header.filters'),
                    dataIndex: 'filters',
                    width: 200,
                    renderer: function(value) {
                        var columnString = [];
                        for (var i = 0; i < value.length; i++) {
                            columnString.push(value[i].label);
                        }
                        return columnString.join(', ');
                    }
                }]
            }, {
                title: i18n.getMsg('querygrid.stammdaten.title'),
                xtype: 'grid',
                viewConfig: {
                    markDirty: false,
                    getRowClass: function() {
                        return 'x-lada-multiline-grid';
                    }
                },
                store: stammstore,
                columns: [{
                    header: i18n.getMsg('querygrid.header.favorite'),
                    width: 48,
                    dataIndex: 'favorite',
                    xtype: 'favcolumn'
                }, {
                    header: i18n.getMsg('querygrid.header.name'),
                    dataIndex: 'name',
                    width: 200
                }, {
                    header: i18n.getMsg('querygrid.header.description'),
                    dataIndex: 'description',
                    flex: 1
                }]
            }]
        }];

        this.callParent(arguments);
    }
});
