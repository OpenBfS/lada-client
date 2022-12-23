/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Base class extending Panel to create custom form fields at which
 * notifications, warnings and errors can be displayed using icons
 * and tooltips.
 *
 * When inheriting, use this.insert(0, {... a real form field ...})
 * in initComponent().
 */
Ext.define('Lada.view.widget.base.LadaField', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ladafield',

    warning: null,
    error: null,
    notification: null,

    initComponent: function() {
        this.items = [{
            xtype: 'image',
            name: 'notificationImg',
            src: 'resources/img/warning_gray.png',
            width: 14,
            height: 14,
            hidden: true
        }, {
            xtype: 'image',
            name: 'warnImg',
            src: 'resources/img/dialog-warning.png',
            width: 14,
            height: 14,
            hidden: true
        }, {
            xtype: 'image',
            name: 'errorImg',
            src: 'resources/img/emblem-important.png',
            width: 14,
            height: 14,
            hidden: true
        }];
        this.callParent(arguments);
    },

    showNotifications: function(notifications) {
        this.showMessage(notifications, 'notification');
    },

    showWarnings: function(warnings) {
        this.showMessage(warnings, 'warning');
    },

    showErrors: function(errors) {
        this.showMessage(errors, 'error');
    },

    showMessage: function(message, messageClass) {
        this.clearWarningOrError();

        var imgName, cssClass;
        switch (messageClass) {
            case 'notification':
                imgName = 'notificationImg';
                cssClass = 'x-lada-notification-field';
                break;
            case 'warning':
                imgName = 'warnImg';
                cssClass = 'x-lada-warning-field';
                break;
            case 'error':
                imgName = 'errorImg';
                cssClass = 'x-lada-error-field';
                break;
        }

        // Show icon
        var img = this.down('image[name=' + imgName + ']');
        img.show();

        // Add tooltip
        this[messageClass] = Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: message
        });

        // Format fields
        this.query('field:not(hiddenfield)').forEach(function(field) {
            if (field.inputWrap && field.inputEl) {
                field.inputWrap.addCls(cssClass);
                field.inputEl.addCls(cssClass);
            } else {
                field.onAfter({
                    render: {
                        fn: function(el) {
                            el.inputWrap.addCls(cssClass);
                            el.inputEl.addCls(cssClass);
                        },
                        single: true
                    }
                });
            }
        });

        // Format parent fieldset
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var messageText = i18n.getMsg(this.name) + ': ' + message;
            fieldset.showWarningOrError(true, messageText);
        }
    },

    clearWarningOrError: function() {
        // Remove tooltips
        ['notification', 'warning', 'error'].forEach(function(messageClass) {
            var tt = this[messageClass];
            if (tt) {
                tt.destroy();
            }
        });

        // Hide icon
        this.query('image:visible').forEach(function(img) {
            img.hide();
        });

        // Format fields
        var cssClasses = 'x-lada-warning-field '
            + 'x-lada-error-field '
            + 'x-lada-notification-field';
        this.query('field:not(hiddenfield)').forEach(function(field) {
            if (field.inputWrap && field.inputEl) {
                field.inputWrap.removeCls(cssClasses);
                field.inputEl.removeCls(cssClasses);
            } else {
                field.onAfter({
                    render: {
                        fn: function(el) {
                            if (el.inputWrap) {
                                el.inputWrap.removeCls(cssClasses);
                            }
                            el.inputEl.removeCls(cssClasses);
                        },
                        single: true
                    }
                });
            }
            field.clearInvalid();
        });
    }
});
