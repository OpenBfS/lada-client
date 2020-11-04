/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Utility class to schedule and synchronize functions that may not be called
 * simultaneously.
 * Use the enqueue function to schedule functions to call later.
 * Every function must call the finished function to signal it has finished.
 */
Ext.define('Lada.util.FunctionScheduler', {

    /**
     * Function queue
     */
    queue: [],

    /**
     * Running state
     */
    running: false,

    /**
     * Enqueue a function to call later
     * @param func Function object
     * @param args Argument array
     * @param scope Object to use as this inside the called function.
     */
    enqueue: function(func, args, scope) {
        this.queue.push({func: func, args: args, scope: scope});
    },

    /**
     * Called if a function has finished. Starts the next function.
     */
    finished: function() {
        this.running = false;
        this.next();
    },

    /**
     * Start the sheduled functions
     */
    next: function() {
        if (!this.running && this.queue.length >= 1) {
            this.running = true;
            var current = this.queue.shift();
            var func = current.func;
            var args = current.args;
            var scope = current.scope;

            func.apply(scope, args);
        }
    }
});
