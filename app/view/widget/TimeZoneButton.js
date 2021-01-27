/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Button widget which triggers a timezonechange and keeps track of pending
 * requests.
 */
Ext.define('Lada.view.widget.TimeZoneButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.timezonebutton',

    /**
     * @private
     * True if this component is waiting for requests
     */
    waiting: false,

    /**
     * @private
     * Number of components to wait for
     */
    componentsToWaitFor: 0,

    /**
     * @private
     * Number of components finished loading
     */
    componentsFinished: 0,

    /**
     * Reset this component
     */
    reset: function() {
        this.waiting = false;
        this.enable();
        this.componentsFinished = 0;
        this.componentsToWaitFor = 0;
    },

    /**
     * Start the timezone change.
     * Disables the buttons until all requests finished.
     * @param {Number} componentsToWaitFor Number of components to wait for
     */
    startToggle: function(componentsToWaitFor) {
        this.waiting = true;
        this.componentsToWaitFor = componentsToWaitFor;
        this.componentsFinished = 0;
        this.disable();
    },

    /**
     * Notify this component that a component finished loading.
     */
    requestFinished: function() {
        this.componentsFinished++;
        if (this.componentsFinished >= this.componentsToWaitFor) {
            this.reset();
        }
    }
});
