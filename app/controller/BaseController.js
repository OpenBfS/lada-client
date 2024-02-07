/* Copyright (C) 2023 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Base class for controllers.
 */
Ext.define('Lada.controller.BaseController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.basecontroller',

    /**
     * Handle failures of requests that are not model operations
     * @param {*} response Response object
     * @param {*} titleMsg Title message, optional
     */
    handleRequestFailure: function(response, opts, titleMsg) {
        var i18n = Lada.getApplication().bundle;
        var msg = '';
        //Check for bean validation messages
        if (response.getResponseHeader('validation-exception')) {
            var errors = this.getBeanValidationErrors(response);
            for (const [key, value] of Object.entries(errors)) {
                var violations = '';
                // eslint-disable-next-line no-loop-func
                value.forEach(violation =>
                    violations += `<br>    - ${violation}`);
                msg += `${key}: ${violations}<br>`;
            }
        } else {
            //Handle other Http error codes
            msg = this.getHttpError(response);
        }
        Ext.Msg.alert(
            i18n.getMsg(titleMsg ? titleMsg : 'err.msg.generic.title'), msg);
    },

    /**
     * Failure callback function for proxy operations.
     *
     * An optional i18n key for the title of the displayed error
     * message box can be given.
     *
     * Returns the parsed JSON payload of the response, if available,
     * else returns null.
     */
    handleServiceFailure: function(record, operation, titleMsg, skipAlert) {
        var i18n = Lada.getApplication().bundle;
        var err = operation.getError();
        var msg;
        var responseJson = null;
        if (err) {
            if (err instanceof String) {
                msg = err;
            } else {
                var response = err.response;
                if (response.getResponseHeader('validation-exception')) {
                    var errors = this.getBeanValidationErrors(response, record);
                    msg = i18n.getMsg('604');
                    responseJson = { data: { errors: errors }};
                } else {
                    msg = this.getHttpError(response);
                }
            }
        } else {
            responseJson = Ext.decode(operation.getResponse().responseText);
            if (responseJson.message) {
                msg = i18n.getMsg(responseJson.message);
            }
        }
        if (!skipAlert) {
            Ext.Msg.alert(i18n.getMsg(
                titleMsg ? titleMsg : 'err.msg.generic.title'), msg);
        }
        return responseJson;
    },

    getHttpError: function(response) {
        var i18n = Lada.getApplication().bundle;
        var msg = i18n.getMsg('err.msg.generic.body');
        if (response.timedout) {
            // Handle timeout
            msg = i18n.getMsg('err.msg.timeout');
        } else {
            // Handle general HTTP errors
            msg = response.responseText
                ? response.responseText
                : response.statusText;
        }
        return msg;
    },

    getBeanValidationErrors: function(response, record) {
        // Translate RESTEasy validation violation report
        var violations = Ext.decode(response.responseText)
            .parameterViolations;
        var errors = {};
        for (var violation of violations) {
            var path = violation.path.split('\.');
            var key = path.pop();

            // Skip path suffixes such as "<list element>" that cannot
            // be assigned to a concrete attribute and might be
            // misinterpreted as HTML
            key = key.search(/^<.+>$/) > -1 ? path.pop() : key;

            key = record && key === 'arg0' // Key for class-level violations
                // Convert to snake_case to match audit-trail keys.
                ? record.entityName.match(/([A-Z][a-z]*)/g)
                    .join('_').toLowerCase()
                : key;

            if (errors[key]) {
                errors[key].push(violation.message);
            } else {
                errors[key] = [violation.message];
            }
        }
        return errors;
    }
});
