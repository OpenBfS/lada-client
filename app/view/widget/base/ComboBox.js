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

    border: 0,

    margin: '0, 0, 5, 0',

    initComponent: function() {
        if (this.editable === undefined) {
            this.editable = true;
        }
        if (this.allowBlank === undefined) {
            this.allowBlank = true;
        }
        this.items = [{
            xtype: 'combobox',
            flex: 1,
            name: this.name,
            maxLength: this.maxLength,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            listeners: this.listeners,
            store: this.store,
            displayField: this.displayField,
            valueField: this.valueField,
            emptyText: this.emptyText,
            autoSelect: this.autoSelect || true,
            queryMode: this.queryMode,
            triggerAction: this.triggerAction,
            typeAhead: this.typeAhead,
            minChars: this.minChars,
            maxChars: this.maxChars,
            multiSelect: this.multiSelect,
            editable: this.editable,
            readOnly: this.readOnly,
            allowBlank: this.allowBlank,
            forceSelection: this.forceSelection || false,
            msgTarget: 'none',
            value: this.value,
            tpl: this.tpl,
            displayTpl: this.displayTpl,
            // disable filtering of entries if disableKeyFilter is true
            disableKeyFilter: this.disableKeyFilter || false,
            triggerAction: this.disableKeyFilter? 'all' : 'query'
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
        /* listeners have been passed to combobox. Thus, clear them on panel
         * to avoid double effects of events fired on combobox and panel. */
        this.clearListeners();
    },

    showWarnings: function(warnings) {
        var img = this.down('image[name=warnImg]');
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
        this.down('combobox').invalidCls = 'x-lada-warning';
        this.down('combobox').markInvalid('');
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var warningText = i18n.getMsg(this.name) + ': ' + warnings;
            fieldset.showWarningOrError(true, warningText);
        }
    },

    showErrors: function(errors) {
        var img = this.down('image[name=errorImg]');
        var warnImg = this.down('image[name=warnImg]');
        warnImg.hide();
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: errors
        });
        this.down('combobox').invalidCls = 'x-lada-error';
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
        this.down('image[name=errorImg]').hide();
        this.down('image[name=warnImg]').hide();
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
    }
});
