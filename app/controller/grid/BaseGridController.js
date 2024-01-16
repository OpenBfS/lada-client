/* Copyright (C) 2023 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Base class for grid controllers.
 */
Ext.define('Lada.controller.grid.BaseGridController', {
    extend: 'Lada.controller.BaseController',

    /**
     * Failure callback function for saving of records in editable grids.
     *
     * If the record from the editing context is passed, messages at the
     * response are transferred to the record for display in the grid.
     */
    handleSaveFailure: function(record, response, editContextRecord) {
        var json = this.handleServiceFailure(
            record, response, 'err.msg.save.title');
        if (json && json.data && editContextRecord) {
            for (var msgKey of ['errors', 'warnings', 'notifications']) {
                var msgs = json.data[msgKey];
                if (msgs) {
                    editContextRecord.set(msgKey, msgs);
                }
            }
        }
    }
});
