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
    model: 'Lada.model.Query',
    //    autoLoad: true,
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/universal',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
