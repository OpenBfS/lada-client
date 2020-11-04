/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
  * Store Regierungsbezirk for regierungsbezirk filter. Will not be obtained
  * from server. It is a subset of Verwaltungseinheiten
  * ('is_regbezirk')
 */
Ext.define('Lada.store.Regierungsbezirk', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Verwaltungseinheit',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
