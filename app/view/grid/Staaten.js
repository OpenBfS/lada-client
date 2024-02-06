/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Stammdaten for Countries
 */
Ext.define('Lada.view.grid.Staaten', {
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.staatengrid',

    requires: ['Ext.grid.filters.Filters',
        'Lada.view.widget.PagingSize'],
    plugins: 'gridfilters',
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    },

    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    allowDeselect: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.staatengrid');
        this.columns = [{
            header: i18n.getMsg('isocode'),
            renderer: function(value) {
                if (!value || value === '') {
                    return '--';
                }
                return value;
            },
            dataIndex: 'iso3166'
        }, {
            header: i18n.getMsg('name'),
            dataIndex: 'ctry',
            flex: 1,
            align: 'start'
        }];

        this.store = Ext.create('Lada.store.Staaten');
        this.store.loadPage(1);
        this.setTitle(i18n.getMsg('title.staaten'));
        this.store.on('load', this.setTitleFromStore, this);

        this.callParent(arguments);

        this.down('pagingtoolbar').add('-');
        this.down('pagingtoolbar').add(
            Ext.create('Lada.view.widget.PagingSize'));
    },

    setTitleFromStore: function(store) {
        var i18n = Lada.getApplication().bundle;
        this.setTitle(
            i18n.getMsg('title.staaten')
                + ' (' + store.getCount() + ')');
    },

    /**
     * This sets the Store of this Grid
     */
    setStore: function(store) {
        if (store) {
            this.store = store;
            this.addLoadingFailureHandler(this.store);
            this.reconfigure(store);
            this.setTitleFromStore(store);
        }
    },

    reload: function() {
        if (!this.store) {
            Ext.log({msg: 'Staaten store is null', level: 'warn'});
            return;
        }
        this.hideReloadMask();
        this.store.reload();
    }
});
