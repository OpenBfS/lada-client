/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for models that are used in toolbars with paging, but with local data.
 * Overwrites filterchange listener and loadPage with a filter (items per page)
 * TODO: loadPage is not always triggered (another filter being applied initially?)
 */
Ext.define('Lada.store.LocalPagingStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    /*items per page, may be overwritten with value in individual store,*/
    pageSize: 25, // TODO needs default config somewhere

    /* creates a new filter with the current page setting.*/
    createPageFilter : function (){
        var me = this;
        return new Ext.util.Filter({
            filterFn: function(record){
                var low = (me.currentPage -1) * me.pageSize;
                var high = (me.currentPage) * me.pageSize -1;
                if (me.getRange(low,high).indexOf(record) > -1){
                    return true;
                }
                return false;
            },
            id: 'pageFilter'
        });
    },

    /* overwrite Ext.data.Store function. Remove old paging filter and apply
     * new one */
    loadPage: function(page){
        // check if there is really a pagingtoolbar behind the store to be manipulated
        // toolbar and grid are not used here, but needed to verify TODO
        var tbs = Ext.ComponentQuery.query('pagingtoolbar');
        if (!tbs.length){return;}
        for (var i= 0; i< tbs.length; i++){
            var grid = tbs[i].up('grid');
            if (!grid || !grid.store.model || grid.store.model != this.model ){
                continue;
            }
        this.removeFilter('pageFilter');
        var count = this.getCount();
        var maxpages = Math.ceil(count / this.pageSize);
        page = (page > maxpages) ? maxpages : page;
        this.currentPage = page;
        this.pageFilter = this.createPageFilter();
        this.addFilter(this.pageFilter);
        }
    },

    /*
     * custom listener filterchange: update the paging toolbar to reflect changes.
     */
    listeners: {
        filterchange: function(store){
            var tbs = Ext.ComponentQuery.query('pagingtoolbar');
            for (var i= 0; i< tbs.length; i++){
                var grid = tbs[i].up('grid');
                if (!grid || !grid.store.model ||
                    grid.store.model != store.model ){
                    continue;
                }
                tbs[i].onLoad();
                var count = store.getCount();
                tbs[i].afterPageText = 'von ' + Math.ceil(count / store.pageSize);
                tbs[i].displayMsg = 'Zeige Eintrag {0} - {1} von ' + count;
                break;
            }
        }
    }
});
