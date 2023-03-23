/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form panel base class.
 */
Ext.define('Lada.view.form.LadaForm', {
    extend: 'Ext.form.Panel',

    /**
     * Display errors, warnings and notifications as provided by
     * LADA-Server at components having the respective show* methods.
     */
    setMessages: function(errors, warnings, notifications) {
        this.clearMessages();

        var allMessages = {
            notification: notifications,
            warning: warnings,
            error: errors
        };
        var i18n = Lada.getApplication().bundle;
        const msgNotFound = /\.undefined$/;
        for (var msgCat in allMessages) {
            var messages = allMessages[msgCat];
            for (var key in messages) {
                var tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                var element = this.down('component[name=' + tmp + ']');
                if (!element) {
                    continue;
                }
                var content = '';
                for (var msg of messages[key]) {
                    // If key not found, assume message translated by server
                    content += i18n.getMsg(msg.toString())
                        .replace(msgNotFound, '') + '<br>';
                }
                element.showMessage(content, msgCat);
            }
        }
    },

    clearMessages: function() {
        this.query('ladafield').forEach(function(field) {
            field.clearWarningOrError();
        });
        this.query('fset').forEach(function(fset) {
            fset.clearMessages();
        });
    },

    /**
     * Set readOnly config of all fields in the component.
     */
    setReadOnly: function(readOnly) {
        this.query('field').forEach(function(field) {
            field.setReadOnly(readOnly);
        });
    }
});
