/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store Landkreis for landkreis filter. Will not be obtained from server. It is a subset of Verwaltungseinheiten
 * ('isLandkreis')
 */
Ext.define('Lada.store.Landkreis', {
    extend: 'Lada.store.Verwaltungseinheiten',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
