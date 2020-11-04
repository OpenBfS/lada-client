/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Utility class to keep track of all open object windows.
 * To enable tracking for a new window type:
 *   - Add a new type to this.recordTypes
 *   - Create a window class inheriting from Lada.view.window.TrackedWindow
 *   - Set NewWindowclass.recordType to the new Type
 */
Ext.define('Lada.util.WindowTracker', {

    statics: {
        /**
         * Known record types
         */
        recordTypes: ['datensatzerzeuger', 'messprogramm',
            'messprogrammkategorie', 'messung', 'ort', 'ortszuordnung',
            'probe', 'probenehmer'],

        /**
         * Map of (type, map)
         * Contains maps of (recordId, window) which are used to track open windows
         * for each record of each type
         */
        maps: Ext.create('Ext.util.HashMap'),

        /**
         * Is tracker initialized?
         */
        initialized: false,

        /**
         * Initialize all maps
         */
        init: function() {
            if (!this.initialized) {
                this.initialized = true;
                for (var i = 0; i < this.recordTypes.length; i++) {
                    var type = this.recordTypes[i];
                    this.maps.add(type, Ext.create('Ext.util.HashMap'));
                }
            }
        },

        /**
         * Signal that a window was closed
         * @param type Object type: 'probe', 'messung', ...
         * @param id Object id
         * @param window Window instance
         */
        close: function(type, id, window) {
            this.init();
            var map = this.maps.get(type);
            if (map) {
                if (this.isOpen(type, id)) {
                    map.remove(window);
                } else {
                    //raise error
                }
            }
        },

        /**
         * Signal that a window was opened
         * @param type Object type: 'probe', 'messung', ...
         * @param id Object id
         * @param window Window instance
         */
        open: function(type, id, window) {
            this.init();
            var map = this.maps.get(type);
            if (map) {
                if (!this.isOpen(type, id)) {
                    map.add(id, window);
                } else {
                    //raise error
                }
            }
        },

        /**
         * Focus an open window
         * @param type Object type: 'probe', 'messung', ...
         * @param id Object id
         */
        focus: function(type, id) {
            this.init();
            var map = this.maps.get(type);
            if (map) {
                if (this.isOpen(type, id)) {
                    map.get(id, window).setCollapsed(false);
                    map.get(id, window).focus();
                } else {
                    //Raise error
                }
            }
        },

        /**
         * Check if a window of an object is already open
         * @param type Object type: 'probe', 'messung', ...
         * @param id Object id
         * @return true if window is already open, else false
         */
        isOpen: function(type, id) {
            this.init();
            var open = false;
            var map = this.maps.get(type);
            if (map) {
                if (!map.get(id)) {
                    open = false;
                } else {
                    open = true;
                }
            }
            return open;
        }
    }
});
