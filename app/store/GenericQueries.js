/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for generic queries
 */
Ext.define('Lada.store.GenericQueries', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Query',
    //    autoLoad: true,
    //TODO: Use server rest url for gen. queries
    /*proxy: {
        type: 'rest',
        url: 'lada-server/rest/query/generic',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }*/
});
