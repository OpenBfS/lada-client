/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Store for Messgroessen
 */
Ext.define('Lada.store.StaMessgroessen', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.StaMessgroesse',
    sorters: [{
        property: 'messgroesse',
        transform: function(val) {
            if (val) {
                return val.toLowerCase();
            } else {
                return "";
            };
        }
    }],
    autoLoad: true
});
