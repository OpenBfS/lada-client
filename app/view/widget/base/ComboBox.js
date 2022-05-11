/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel to creat a custom Combobox
 */
Ext.define('Lada.view.widget.base.ComboBox', {
    extend: 'Ext.form.Panel',
    alias: 'widget.cbox',

    layout: 'hbox',
    border: false,
    margin: '0, 0, 5, 0',

    warning: null,
    error: null,
    notification: null,

    isFormField: true,
    submitValue: true,
    defaultInputWrapCls: null,

    initComponent: function() {
        if (this.editable === undefined) {
            this.editable = true;
        }
        if (this.allowBlank === undefined) {
            this.allowBlank = true;
        }
        var dkf = false;
        var ta = 'all';
        if (this.disableKeyFilter !== undefined) {
            dkf = this.disableKeyFilter;
            ta = this.disableKeyFilter ? 'all' : 'query';
        }
        this.items = [{
            xtype: this.multiSelect ? 'tagfield' : 'combobox',
            flex: 1,
            name: this.name,
            maxLength: this.maxLength,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            listeners: this.listenersJson,
            store: this.store,
            displayField: this.displayField,
            valueField: this.valueField,
            // additional field to search for in typing filters.
            // If not present, the combobox value may be used
            searchValueField: this.searchValueField || null,
            emptyText: this.emptyText,
            autoSelect: this.autoSelect || true,
            queryMode: this.queryMode,
            lastQuery: this.lastQuery || '',
            typeAhead: this.typeAhead,
            minChars: this.minChars,
            maxChars: this.maxChars,
            multiSelect: this.multiSelect,
            isFormField: this.isFormField,
            submitValue: this.submitValue,
            editable: this.editable,
            readOnly: this.readOnly,
            allowBlank: this.allowBlank,
            forceSelection: this.forceSelection || false,
            msgTarget: 'none',
            value: this.value,
            tpl: this.tpl,
            displayTpl: this.displayTpl,
            labelTpl: this.labelTpl,
            // disable filtering of entries if disableKeyFilter is true
            disableKeyFilter: dkf,
            triggerAction: ta,
            matchFieldWidth: this.matchFieldWidth || false,
            listConfig: this.listConfig || {maxWidth: 400}
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

        /* listeners have been passed to combobox. Thus, clear them on panel
         * to avoid double effects of events fired on combobox and panel. */
        this.clearListeners();

        this.defaultInputWrapCls = this.down('combobox').inputWrapCls;
    },

    showNotifications: function(notifications) {
        this.clearWarningOrError();
        var img = this.down('image[name=notificationImg]');
        var tt = Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: notifications
        });
        this.notification = tt;
        var cb = this.down('combobox');
        if (cb.inputWrap && cb.inputEl) {
            cb.inputWrap.addCls('x-lada-notification-field');
            cb.inputEl.addCls('x-lada-notification-field');
        } else {
            cb.onAfter({
                render: {
                    fn: function(el) {
                        el.inputWrap.addCls('x-lada-notification-field');
                        el.inputEl.addCls('x-lada-notification-field');
                    },
                    single: true
                }
            });
        }
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var notificationText = i18n.getMsg(this.name) +
                ': ' + notifications;
            fieldset.showWarningOrError(true, notificationText);
        }
    },

    showWarnings: function(warnings) {
        this.clearWarningOrError();
        var img = this.down('image[name=warnImg]');
        var tt = Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
        this.warning = tt;
        var cb = this.down('combobox');
        if (cb.inputWrap && cb.inputEl) {
            cb.inputWrap.addCls('x-lada-warning-field');
            cb.inputEl.addCls('x-lada-warning-field');
        } else {
            cb.onAfter({
                render: {
                    fn: function(el) {
                        el.inputWrap.addCls('x-lada-warning-field');
                        el.inputEl.addCls('x-lada-warning-field');
                    },
                    single: true
                }
            });
        }

        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var warningText = i18n.getMsg(this.name) + ': ' + warnings;
            fieldset.showWarningOrError(true, warningText);
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
        this.down('combobox').markInvalid('');
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var errorText = i18n.getMsg(this.name) + ': ' + errors;
            fieldset.showWarningOrError(false, '', true, errorText);
        }
    },

    clearWarningOrError: function() {
        if (this.warning) {
            this.warning.destroy();
        }
        if (this.error) {
            this.error.destroy();
        }
        if (this.notification) {
            this.notification.destroy();
        }
        this.down('image[name=errorImg]').hide();
        this.down('image[name=warnImg]').hide();
        this.down('image[name=notificationImg]').hide();
        var cb = this.down('combobox');
        if (cb.inputWrap && cb.inputEl) {
            cb.inputWrap.removeCls('x-lada-warning-field');
            cb.inputWrap.removeCls('x-lada-error-field');
            cb.inputWrap.removeCls('x-lada-notification-field');
            cb.inputEl.removeCls('x-lada-warning-field');
            cb.inputEl.removeCls('x-lada-error-field');
            cb.inputEl.removeCls('x-lada-notification-field');
        } else {
            cb.onAfter({
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
        cb.clearInvalid();
    },

    getValue: function() {
        return this.down('combobox').getValue();
    },

    setValue: function(value) {
        this.down('combobox').setValue(value);
    },

    clearValue: function() {
        this.down('combobox').clearValue();
    },

    getName: function() {
        return this.name;
    },

    setReadOnly: function(value) {
        this.down('combobox').setReadOnly(value);
    },

    setStore: function(store) {
        this.store = store;
        this.down('combobox').setStore(store);
    }
});
