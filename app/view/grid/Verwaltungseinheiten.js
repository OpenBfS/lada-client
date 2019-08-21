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
    extend: 'Ext.grid.Panel',
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
        this.store = Ext.create('Lada.store.Verwaltungseinheiten');
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('grid.emptyGrid');
        this.columns = [{
            header: i18n.getMsg('code'),
            dataIndex: 'id'
        }, {
            header: i18n.getMsg('name'),
            dataIndex: 'bezeichnung',
            flex: 1
        }];
        if (this.store) {
            this.store.loadPage(1);
            this.setTitle(
                'Verwaltungseinheiten (' + this.store.getCount() + ')');
        }
        var cbox = Ext.create('Lada.view.widget.PagingSize');
        this.callParent(arguments);
        this.down('pagingtoolbar').add('-');
        this.down('pagingtoolbar').add(cbox);
    },

    /**
     * This sets the Store of this Grid
     */
    setStore: function(store) {
        if (store) {
            this.reconfigure(store);
            this.setTitle(
                'Verwaltungseinheiten (' + store.getCount() + ')');
        }
    }
});
