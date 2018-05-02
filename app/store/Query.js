/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Queries
 */
Ext.define('Lada.store.Query', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Query',
    // proxy: {
    //     type: 'rest',
    //     url: 'lada-server/rest/query',
    //     reader: {
    //         type: 'json',
    //         rootProperty: 'data'
    //     }
    // }
    data: [{
        'id': 1,
        'name': 'Dummyquery',
        'query': 1,
        'description': 'Query not yet fully impletmented',
        'owner': true,
        'sql': ''
    }]
});
