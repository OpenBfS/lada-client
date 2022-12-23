/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Base window class which overrides show and close functions to use the
 * WindowTracker functions.
 * Overwrite recordType to make use of the tracking.
 * If the record used in the window is not loaded yet, the recordId attribute
 * must be set as windows with
 * neither record nor id will be considered as windows with new records.
 */
Ext.define('Lada.view.window.TrackedWindow', {
    extend: 'Ext.window.Window',

    record: null,

    recordId: null,

    recordType: null,

    /**
     * Set the new record
     * @param {Ext.data.Model} record The new record
     */
    setRecord: function(record) {
        this.record = record;
        this.recordId = record.get('id');
    },

    /**
     * Checks if a window for the current record is already open.
     * If so, the already exisiting window will be focus, else
     * this window will be shown.
     * @return True if window will be shown, else false
     */
    show: function() {
        var id = this.record ? this.record.get('id') : this.recordId;
        if (!id) {
            //This is a new record
            this.callParent();
            return true;
        }
        if (Lada.util.WindowTracker.isOpen(this.recordType, id)) {
            Lada.util.WindowTracker.focus(this.recordType, id);
            return false;
        } else {
            Lada.util.WindowTracker.open(this.recordType, id, this);
            this.callParent();
            return true;
        }
    },


    close: function() {
        var id = this.record ? this.record.get('id') : this.recordId;
        Lada.util.WindowTracker.close(this.recordType, id, this);
        this.callParent();
    }
});
