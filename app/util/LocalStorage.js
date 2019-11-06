/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

 /**
  * Utility class providing Functions to read/write local storage properties.
  */
Ext.define('Lada.util.LocalStorage', {

    statics: {

        DOKPOOL_EVENT_KEY: 'koala-dokpool-events',

        /**
         * Sets value (JSON encoded) in LocalStorage under given key
         *
         * @param {String} key Key of item in LocalStorage to set
         * @param {Object} value The value to persist
         */
        setProperty: function(key, value) {
            if (key) {
                var valueToPersist = JSON.stringify(value);
                window.localStorage.setItem(key, valueToPersist);
            }
        },

        /**
         * Gets value from LocalStorage of given key
         *
         * @param {String} key The key to retreive the value from
         *
         * @returns {Object} The (parsed) object from LocalStorage if available
         */
        getProperty: function(key) {
            if (key) {
                try {
                    var loadedValue = window.localStorage.getItem(key);
                    return JSON.parse(loadedValue);
                } catch (error) {
                    return null;
                }
            }
            return null;
        },

        /**
         * Updates koala-dokpool-scenario in LocalStorage
         *
         * @param {Object} the current state of scenario
         *                 used to check for changes later on
         */
        updateDokpoolEvents: function(scenarios) {
            this.setProperty(this.DOKPOOL_EVENT_KEY, scenarios);
            Ext.fireEvent('localElanStorageUpdated');
        },

        /**
         * Returns the value of koala-dokpool-scenario from LocalStorage
         * @param {Object} the current state of scenario
         *                 used to check for changes later on
         */
        getDokpoolEvents: function() {
            return this.getProperty(this.DOKPOOL_EVENT_KEY);
        }
    }
});