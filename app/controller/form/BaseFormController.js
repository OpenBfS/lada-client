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
    extend: 'Ext.app.ViewController',

    /**
     * Failure callback function for the records 'save' method.
     *
     * Use with 'record.save({scope: this, failure: this.handleSaveFailure})'
     */
    handleSaveFailure: function(record, response) {
        var form = this.getView();
        form.loadRecord(record);
        var i18n = Lada.getApplication().bundle;
        var err = response.getError();
        var msg = i18n.getMsg('err.msg.generic.body');
        if (err) {
            if (err instanceof String) {
                msg = err;
            } else {
                msg = err.response.responseText;
                if (!msg && err.response.timedout) {
                    msg = i18n.getMsg('err.msg.timeout');
                }
            }
        } else {
            var json = Ext.decode(response.getResponse().responseText);
            if (json.message) {
                msg = i18n.getMsg(json.message);
            }
            form.setMessages(
                json.errors, json.warnings, json.notifications);
        }
        Ext.Msg.alert(i18n.getMsg('err.msg.save.title'), msg);
        form.setLoading(false);
    }
});
