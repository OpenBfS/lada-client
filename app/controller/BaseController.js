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
        var msg = i18n.getMsg('err.msg.generic.body');
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
                    msg = response.responseText;
                    if (!msg && response.timedout) {
                        msg = i18n.getMsg('err.msg.timeout');
                    }
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
    }
});
