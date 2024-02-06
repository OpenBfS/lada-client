/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Orte Stammdaten
 */
Ext.define('Lada.view.grid.Verwaltungseinheiten', {
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.verwaltungseinheitengrid',
    requires: ['Ext.grid.filters.Filters',
        'Lada.view.widget.PagingSize'],

    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,

    plugins: 'gridfilters',
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    },
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.verwaltungsgrid');
        this.columns = [{
            header: i18n.getMsg('code'),
            dataIndex: 'id'
        }, {
            header: i18n.getMsg('name'),
            dataIndex: 'name',
            flex: 1
        }];

        this.store = Ext.create('Lada.store.Verwaltungseinheiten');
        this.store.loadPage(1);
        this.setTitle(i18n.getMsg('title.verwaltungseinheiten'));
        this.store.on('load', this.setTitleFromStore, this);

        this.callParent(arguments);

        this.down('pagingtoolbar').add('-');
        this.down('pagingtoolbar').add(
            Ext.create('Lada.view.widget.PagingSize'));
    },

    setTitleFromStore: function(store) {
        var i18n = Lada.getApplication().bundle;
        this.setTitle(
            i18n.getMsg('title.verwaltungseinheiten')
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

    /**
     * Reload the grid
     */
    reload: function() {
        if (!this.store) {
            Ext.log({msg: 'Verwaltungseinheiten store is null', level: 'warn'});
            return;
        }
        this.hideReloadMask();
        this.store.reload();
    }
});
