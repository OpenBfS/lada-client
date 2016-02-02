/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel to create a custom Checkbox
 */
Ext.define('Lada.view.widget.base.CheckBox', {
    extend: 'Ext.form.Panel',
    alias: 'widget.chkbox',

    layout: 'hbox',

    border: 0,

    margin: '0, 0, 5, 0',

    initComponent: function() {
        this.items = [{
            xtype: 'checkbox',
            flex: 1,
            name: this.name,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            listeners: this.listeners,
            triggerAction: this.triggerAction,
            readOnly: this.readOnly,
            msgTarget: 'none',
            tpl: this.tpl
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

    showWarnings: function(warnings) {
        var img = this.down('image[name=warnImg]');
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
        this.down('checkbox').invalidCls = 'x-lada-warning';
        this.down('checkbox').markInvalid('');
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
        this.down('checkbox').invalidCls = 'x-lada-error';
        this.down('checkbox').markInvalid('');
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
        return this.down('checkbox').getValue();
    },

    setValue: function(value) {
        this.down('checkbox').setValue(value);
    },

    getName: function() {
        return this.name;
    },

    setReadOnly: function(value) {
        this.down('checkbox').setReadOnly(value);
    }
});
