/* Copyright (C) 2023 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Base class for form controllers.
 */
Ext.define('Lada.controller.form.BaseFormController', {
    extend: 'Lada.controller.BaseController',

    /**
     * Failure callback function for the records 'save' method.
     *
     * Use with 'record.save({scope: this, failure: this.handleSaveFailure})'
     */
    handleSaveFailure: function(record, response) {
        var form = this.getView();
        form.loadRecord(record);
        var json = this.handleServiceFailure(
            record, response, 'err.msg.save.title');
        if (json && json.data) {
            form.setMessages(
                json.data.errors, json.data.warnings, json.data.notifications);
        }
        form.setLoading(false);
    }
});
