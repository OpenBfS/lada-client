/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Messmethoden
 */
Ext.define('Lada.store.Messmethoden', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Messmethode',
    sorters: [{
        property: 'messmethode',
        transform: function(val) {
            if (val) {
                return val.toLowerCase();
            }
            return '';
        }
    }],
    autoLoad: true
});
