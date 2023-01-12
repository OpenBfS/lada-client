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

        var key;
        var element;
        var content;
        var tmp;
        var i18n = Lada.getApplication().bundle;
        if (warnings) {
            for (key in warnings) {
                tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                element = this.down('component[name=' + tmp + ']');
                if (!element) {
                    continue;
                }
                content = warnings[key];
                var warnText = '';
                for (var i = 0; i < content.length; i++) {
                    warnText += i18n.getMsg(content[i].toString()) + '\n';
                }
                element.showWarnings(warnText);
            }
        }
        if (notifications) {
            for (key in notifications) {
                tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                element = this.down('component[name=' + tmp + ']');
                if (!element) {
                    continue;
                }
                content = notifications[key];
                var notificationText = '';
                for (var j = 0; j < content.length; j++) {
                    notificationText += i18n.getMsg(
                        content[j].toString()) + '\n';
                }
                element.showNotifications(notificationText);
            }
        }
        if (errors) {
            for (key in errors) {
                tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                element = this.down('component[name=' + tmp + ']');
                if (!element) {
                    continue;
                }
                content = errors[key];
                var errorText = '';
                for (var k = 0; k < content.length; k++) {
                    errorText += i18n.getMsg(content[k].toString()) + '\n';
                }
                element.showErrors(errorText);
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
