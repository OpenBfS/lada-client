/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Verwaltungseinheiten
 */
Ext.define('Lada.store.Verwaltungseinheiten', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Verwaltungseinheit',
    sorters: [{
        property: 'bezeichnung',
        direction: 'ASC'
    }],
    autoLoad: true,
    pageSize: 25, //TODO configurable

    createPageFilter : function (){
        var me = this;
        return function(record){
            var low = (me.currentPage -1) * me.pageSize;
            var high = (me.currentPage) * me.pageSize -1;
            if (me.getRange(low,high).indexOf(record) > -1){
                return true;
            }
            return false;
        };
    },

    loadPage: function(page){
        if (this.pageFilter){
            this.filters.remove(this.pageFilter);
        }
        var count = this.getCount();
        var maxpages = Math.ceil(count / this.pageSize);
        page = (page > maxpages) ? maxpages : page;
        this.currentPage = page;
        this.pageFilter = this.createPageFilter();
        this.filters.add(this.pageFilter);
    }
});
