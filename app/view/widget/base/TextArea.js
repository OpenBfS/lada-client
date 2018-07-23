/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel to create a Textfield
 */
Ext.define('Lada.view.widget.base.TextArea', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tarea',

    layout: 'hbox',

    border: false,
    margin: '0, 0, 5, 0',

    initComponent: function() {
        this.items = [{
            xtype: 'textarea',
            flex: 1,
            name: this.name,
            msgTarget: 'none',
            maxLength: this.maxLength || 1000,
            enforceMaxLength: this.enforceMaxLength || true,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            readOnly: this.readOnly || false,
            listeners: this.listeners,
            type: this.type
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
        if (this.regex) {
            Ext.apply(this.down('textarea'), {regex: this.regex});
        }
        if (this.allowBlank === false) {
            Ext.apply(this.down('textarea'), {allowBlank: this.allowBlank});
        }
    },

    showWarnings: function(warnings) {
        var img = this.down('image[name=warnImg]');
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
        img.show();
        this.down('textarea').invalidCls = 'x-lada-warning-field';
        this.down('textarea').markInvalid('');
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
        this.down('textarea').invalidCls = 'x-lada-error-field';
        this.down('textarea').markInvalid('');
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var errorText = i18n.getMsg(this.name) + ': ' + errors;
            fieldset.showWarningOrError(false, '', true, errorText);
        }
    },

    getValue: function() {
        return this.down('textarea').getValue();
    },

    setValue: function(value) {
        this.down('textarea').setValue(value);
    },

    clearWarningOrError: function() {
        this.down('textarea').clearInvalid();
        this.down('image[name=errorImg]').hide();
        this.down('image[name=warnImg]').hide();
    },

    setReadOnly: function(value) {
        this.down('textarea').setReadOnly(value);
    }
});
