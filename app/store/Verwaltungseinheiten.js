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
    fields: ['gemId', 'bezeichnung', 'longitude', 'latitude'],
    sorters: [{
        property: 'bezeichnung'
    }],
    autoLoad: true,
    proxy: {
        type: 'rest',
        api: {
        read: 'server/rest/verwaltungseinheit'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
