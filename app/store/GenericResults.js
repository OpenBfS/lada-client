/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for generic query results
 */
Ext.define('Lada.store.GenericResults', {
    extend: 'Ext.data.Store',
    storeId: 'genericresults',
    model: 'Lada.model.GenericResults',
    require: ['Lada.query.QueryProxy'],
    proxy: {
        type: 'query',
        timeout: 30 * 1000,
        url: 'lada-server/rest/universal',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    },

    //    autoLoad: true,
    pageSize: Lada.pagingSize
});
