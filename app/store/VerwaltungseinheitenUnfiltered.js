/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Unfiltered Store for Verwaltungseinheiten. Will not be obtained from server,
 * but cloned from the original store on initialization. This allows for dropdown
 * boxes to be independent of grids with this data
 */
Ext.define('Lada.store.VerwaltungseinheitenUnfiltered', {
    extend: 'Lada.store.Verwaltungseinheiten',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
