/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for user defined columns
 */
Ext.define('Lada.store.GridColumn', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.GridColumn',
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/columnvalue',
        reader: {
            type: 'json',
            totalProperty: 'totalCount',
            rootProperty: 'data'
        }
    }
});