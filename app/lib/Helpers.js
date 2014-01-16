/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Helper class
 * This class provides some globally used functions.
*/
Ext.define('Lada.lib.Helpers', {
    statics: {
        /**
         * Function to translate a timestamp into a date
         */
        ts2date: function(v, record){
            // Converts a timestamp into a date object.
            if (v === null || v === undefined) {
                return v;
            }
            return new Date(v);
        }
    }
})
