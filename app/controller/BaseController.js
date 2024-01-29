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
     * @param {*} options request options
     * @param {*} titleMsg Title message, optional
     * @param {*} skipAlert True to skip alert window
     */
    handleRequestFailure: function(response, options, titleMsg, skipAlert) {
        var i18n = Lada.getApplication().bundle;
        var msg;
        if (response.status === 200) {
            return;
        }
        //Check for bean validation messages
        if (response.getResponseHeader('validation-exception')) {
            var text = response.responseText;
            var parts = text.split('\r');
            msg = parts[2]
                .trim()
                .substring(1, parts[2].length - 1);
        } else {
            //Handle other Http error codes
            msg = this.getHttpError(response);
        } if (!skipAlert) {
            Ext.Msg.alert(i18n.getMsg(
                titleMsg ? titleMsg : 'err.msg.generic.title'), msg);
        }
        return msg;
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
                    // Translate RESTEasy validation violation report
                    var violations = Ext.decode(response.responseText)
                        .parameterViolations;
                    var errors = {};
                    for (var violation of violations) {
                        var key = violation.path.split('\.').pop();
                        key = key === 'arg0' // Key for class-level violations
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
    }
});
