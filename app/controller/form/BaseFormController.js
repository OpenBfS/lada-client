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
        if (response.error) {
            //TODO: check content of error.status (html error code)
            Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                          i18n.getMsg('err.msg.generic.body'));
        } else {
            var json = Ext.decode(response.getResponse().responseText);
            if (json) {
                if (json.message) {
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title')
                                  + ' #' + json.message,
                                  i18n.getMsg(json.message));
                } else {
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                  i18n.getMsg('err.msg.generic.body'));
                }
                form.setMessages(
                    json.errors, json.warnings, json.notifications);
            } else {
                Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                              i18n.getMsg('err.msg.response.body'));
            }
        }
        form.setLoading(false);
    }
});
