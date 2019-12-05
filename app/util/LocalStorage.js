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

        CURRENT_USER_KEY: 'koala-current-user',
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
         * Set the current user
         * If user has changed the dookpool events are cleared to ensure they
         * are shown as new to the new user.
         * @param {String} user New username
         */
        setCurrentUser: function(user) {
            var oldUser = this.getProperty(this.CURRENT_USER_KEY);
            if (user !== oldUser) {
                this.updateDokpoolEvents(null);
                this.setProperty(this.CURRENT_USER_KEY, user);
            }
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
            var events = this.getProperty(this.DOKPOOL_EVENT_KEY);
            return events? Ext.clone(events): {};
        },

        /**
         * Return all event keys as array
         * @return {Array} Keys as array
         */
        getDokpoolEventKeys: function() {
            var events = this.getDokpoolEvents();
            return Ext.Object.getKeys(events);
        }
    }
});