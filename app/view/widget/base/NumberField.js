/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel to create a Numberfield
 */
Ext.define('Lada.view.widget.base.NumberField', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.numfield',

    layout: 'hbox',

    border: false,
    margin: '0, 0, 5, 0',

    warning: null,

    error: null,

    initComponent: function() {
        this.items = [{
            xtype: 'numberfield',
            flex: 1,
            name: this.name,
            msgTarget: 'none',
            allowDecimals: this.allowDecimals,
            decimalPrecision: this.decimalPrecision || 2,
            maxLength: this.maxLength || 1000,
            minValue: this.minValue,
            enforceMaxLength: this.enforceMaxLength || true,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            readOnly: this.readOnly || false,
            period: this.period,
            listeners: this.listeners,
            hideTrigger: this.hideTrigger || false,
            keyNavEnabled: this.keyNavEnabled || false,
            mouseWheelEnabled: this.mouseWheelEnabled || false
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
        }, {
            xtype: 'image',
            name: 'notificationImg',
            src: 'resources/img/warning_gray.png',
            width: 14,
            height: 14,
            hidden: true
        }];
        this.callParent(arguments);
        if (this.regex) {
            Ext.apply(this.down('numberfield'), {regex: this.regex});
        }
        if (this.allowBlank === false) {
            Ext.apply(this.down('numberfield'), {allowBlank: this.allowBlank});
        }
    },

    showWarnings: function(warnings) {
        this.clearWarningOrError();
        var img = this.down('image[name=warnImg]');
        this.warning = Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
        img.show();
        var tf = this.down('numberfield');
        if (tf.inputWrap) {
            tf.inputWrap.addCls('x-lada-warning-field');
            tf.inputEl.addCls('x-lada-warning-field');
        } else {
            tf.onAfter({
                render: {
                    fn: function(el) {
                        el.inputWrap.addCls('x-lada-warning-field');
                        el.inputEl.addCls('x-lada-warning-field');
                    },
                    single: true
                }
            });
        }
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var warningText = i18n.getMsg(this.name) + ': ' + warnings;
            fieldset.showWarningOrError(true, warningText);
        }
    },

    showNotifications: function(notifications) {
        this.clearWarningOrError();
        var img = this.down('image[name=notificationImg]');
        this.notification = Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: notifications
        });
        img.show();
        var tf = this.down('numberfield');
        if (tf.inputWrap) {
            tf.inputWrap.addCls('x-lada-notification-field');
            tf.inputEl.addCls('x-lada-notification-field');
        } else {
            tf.onAfter({
                render: {
                    fn: function(el) {
                        el.inputWrap.addCls('x-lada-notification-field');
                        el.inputEl.addCls('x-lada-notification-field');
                    },
                    single: true
                }
            });
        }
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var notificationText = i18n.getMsg(this.name) +
                ': ' + notifications;
            fieldset.showWarningOrError(true, notificationText);
        }
    },

    showErrors: function(errors) {
        this.clearWarningOrError();
        var img = this.down('image[name=errorImg]');
        var warnImg = this.down('image[name=warnImg]');
        warnImg.hide();
        this.error = Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: errors
        });
        this.down('numberfield').invalidCls = 'x-lada-error-field';
        this.down('numberfield').markInvalid('');
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var errorText = i18n.getMsg(this.name) + ': ' + errors;
            fieldset.showWarningOrError(false, '', true, errorText);
        }
    },

    getValue: function() {
        return this.down('numberfield').getValue();
    },

    setValue: function(value) {
        this.down('numberfield').setValue(value);
    },

    clearWarningOrError: function() {
        if (this.warning) {
            this.warning.destroy();
        }
        if (this.error) {
            this.error.destroy();
        }
        var tf = this.down('numberfield');

        tf.invalidCls = 'x-lada-warning-field';
        tf.markInvalid('');

        if (tf.inputWrap) {
            tf.inputWrap.removeCls('x-lada-warning-field');
            tf.inputWrap.removeCls('x-lada-error-field');
            tf.inputWrap.removeCls('x-lada-notification-field');
            tf.inputEl.removeCls('x-lada-warning-field');
            tf.inputEl.removeCls('x-lada-error-field');
            tf.inputEl.removeCls('x-lada-notification-field');
        } else {
            tf.onAfter({
                render: {
                    fn: function(el) {
                        el.inputWrap.removeCls('x-lada-warning-field');
                        el.inputWrap.removeCls('x-lada-error-field');
                        el.inputWrap.removeCls('x-lada-notification-field');
                        el.inputEl.removeCls('x-lada-warning-field');
                        el.inputEl.removeCls('x-lada-error-field');
                        el.inputEl.removeCls('x-lada-notification-field');
                    },
                    single: true
                }
            });
        }
        this.down('numberfield').clearInvalid();
        this.down('image[name=errorImg]').hide();
        this.down('image[name=warnImg]').hide();
        this.down('image[name=notificationImg]').hide();
    },

    setReadOnly: function(value) {
        this.down('numberfield').setReadOnly(value);
    }
});
