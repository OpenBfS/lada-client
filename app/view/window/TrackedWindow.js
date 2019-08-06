

/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Base window class which overrides show and close functions to use the WindowTracker functions.
 * Overwrite recordType to make use of the tracking.
 */
Ext.define('Lada.view.window.TrackedWindow', {
    extend: 'Ext.window.Window',

    record: null,

    recordType: null,

    /**
     * Checks if a window for the current record is already open.
     * If so, the already exisiting window will be focus, else
     * this window will be shown.
     * @return True if window will be shown, else false
     */
    show: function() {
        if (Lada.util.WindowTracker.isOpen(this.recordType, this.record.get('id'))) {
            Lada.util.WindowTracker.focus(this.recordType, this.record.get('id'));
            return false;
        } else {
            Lada.util.WindowTracker.open(this.recordType, this.record.get('id'), this);
            this.callParent();
            return true;
        }
    },


    close: function() {
        Lada.util.WindowTracker.close(this.recordType, this.record.get('id'), this);
        this.callParent();
    }
});
