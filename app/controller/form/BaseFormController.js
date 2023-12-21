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
        /* Validation messages can be served in two ways here:
         *  - Inside the result object (json.data)
         *  - In a separate object as result of an HTTP error (json.errors)
         */
        if (json) {
            var errors = json.data ? json.data.errors : json.errors;
            var warnings = json.data ? json.data.warnings : json.warnings;
            var notifications = json.data ?
                json.data.notifications : json.notifications;
            form.setMessages(errors, warnings, notifications);
        }
        form.setLoading(false);
    }
});
