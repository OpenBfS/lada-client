/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
  * Store Bundesland for bundesland filter. Will not be obtained from server.
  * It is a subset of Verwaltungseinheiten
  * ('isBundesland')
 */
Ext.define('Lada.store.Bundesland', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.AdminUnit',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
