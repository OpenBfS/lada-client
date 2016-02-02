/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Datetimepicker with german date format.
 */
Ext.define('Lada.view.widget.base.Datetime', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datetime',
    requires: [
        'Lada.view.widget.base.DateTimeField'
    ],

    layout: 'hbox',
    tooltip: null,
    border: 0,

    margin: '0, 0, 5, 0',

    initComponent: function() {
        var dateField = Ext.create('Lada.view.widget.base.DateTimeField', {
            format: this.format || 'd.m.Y H:i',
            emptyText: this.emptyText || 'Wählen Sie einen Zeitpunkt',
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            flex: 1,
            name: this.name,
            msgTarget: 'none',
            listeners: this.listeners,
            readOnly: this.readOnly || false,
            period: this.period,
            value: this.value
        });
        this.items = [dateField, {
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
        this.clearWarningOrError();
        var img = this.down('image[name=warnImg]');
        this.tooltip = (!this.tooltip) ? Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        }) : this.tooltip.html = warnings;
        this.down('datetimefield').invalidCls = 'x-lada-warning';
        this.down('datetimefield').markInvalid('');
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
        this.tooltip = (!this.tooltip) ? Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: errors
        }) : this.tooltip.html = errors;
        this.down('datetimefield').invalidCls = 'x-lada-error';
        this.down('datetimefield').markInvalid('');
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var errorText = i18n.getMsg(this.name) + ': ' + errors;
            fieldset.showWarningOrError(false, '', true, errorText);
        }
    },

    getValue: function() {
        return this.down('datetimefield').getValue();
    },

    setValue: function(value) {
        this.down('datetimefield').setValue(value);
    },

    clearWarningOrError: function() {
        this.down('datetimefield').clearInvalid();
        this.down('image[name=errorImg]').hide();
        this.down('image[name=warnImg]').hide();
    },

    setReadOnly: function(value) {
        this.down('datetimefield').setReadOnly(value);
    }
});
