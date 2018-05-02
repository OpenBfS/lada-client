/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Queryresult columns, used in generic Queries
 */
Ext.define('Lada.store.Column', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Column',
    remoteFilter: true,
    remoteSort: true,
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/column',
        reader: {
            type: 'json',
            totalProperty: 'totalCount',
            rootProperty: 'data'
        }
    }
});
