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
 * TODO: loadPage is not always triggered
 * (another filter being applied initially?)
 */
Ext.define('Lada.store.LocalPagingStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    /*items per page, may be overwritten with value in individual store,*/
    pageSize: Lada.pagingSize,



    /* overwrite Ext.data.Store function. Remove old paging filter and apply
     * new one */
    loadPage: function(page) {
        this.removePaging();
        var count = this.getCount();
        this.pageSize = Lada.pagingSize;
        var maxpages = Math.ceil(count / this.pageSize);
        page = (page > maxpages) ? maxpages : page;
        page = !page ? 1: page;
        this.currentPage = page;
        this.applyPaging();
    },

    /* overwrites Ext.data.Store function reload. Remove paging filter before
    * reload, apply pagingFilter after reload, try to load the page that was
    * active before
    */
    reload: function(options) {
        var me = this;
        this.removePaging();
        return this.load(Ext.apply({}, options, this.lastOptions,
            {
                callback: function() {
                    me.loadPage(me.currentPage);
                }
            }
        ));
    },


    /* checks for the removes any paging filter removes it */
    removePaging: function() {
        this.removeFilter('pageFilter');
    },

    /* applies a new paging filter with the current page setting.*/
    applyPaging: function() {
        var me = this;
        //check if there is really a paging toolbar
        var tbs = Ext.ComponentQuery.query('pagingtoolbar');
        if (!tbs.length) {
            return;
        }
        for (var i= 0; i< tbs.length; i++) {
            var grid = tbs[i].up('grid');
            if (
                !grid ||
                !grid.store.model ||
                grid.store.model !== this.model
            ) {
                continue;
            }
            //this.totalCount = this.getCount();
            this.changeToolbar();
            this.pageFilter = new Ext.util.Filter({
                filterFn: function(record) {
                    var low = (me.currentPage -1) * me.pageSize;
                    var high = (me.currentPage) * me.pageSize -1;
                    if (me.getRange(low, high).indexOf(record) > -1) {
                        return true;
                    }
                    return false;
                },
                id: 'pageFilter'
            });
            this.addFilter(this.pageFilter);
            break;
        }
    },

    changeToolbar: function() {
        var i18n= Lada.getApplication().bundle;
        var tbs = Ext.ComponentQuery.query('pagingtoolbar');
        for (var i= 0; i< tbs.length; i++) {
            var grid = tbs[i].up('grid');
            if (!grid || !grid.store.model ||
                grid.store.model !== this.model ) {
                continue;
            }
            var count = this.getCount();
            tbs[i].afterPageText = i18n.getMsg('pagingtoolbar.of')
                + ' ' + Math.ceil(count / this.pageSize);
            var low = (this.currentPage - 1) * this.pageSize + 1;
            var high = Math.min(low - 1 + this.pageSize, count);
            tbs[i].displayMsg = i18n.getMsg('pagingtoolbar.text', low,
                high, count);
            tbs[i].onLoad();
            break;
        }
    }

});
