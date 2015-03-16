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
        'Ext.ux.form.DateTimeField'
    ],

    layout: 'hbox',

    border: 0,

    initComponent: function() {
        this.margin = this.fieldMargin;
        var dateField = Ext.create('Ext.ux.form.DateTimeField', {
            format: 'd.m.Y',
            emptyText: 'Wählen Sie einen Zeitpunkt',
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            flex: 1,
            name: this.name,
            msgTarget: 'none',
            listeners: this.listeners
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
        var img = this.down('image[name=warnImg]');
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
        this.down('datetimefield').invalidCls = 'x-lada-warning';
        this.down('datetimefield').markInvalid('');
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            fieldset.showWarnings(warnings);
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
        this.down('datetimefield').invalidCls = 'x-lada-error';
        this.down('datetimefield').markInvalid('');
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            fieldset.showErrors();
        }
    },

    clearWarningOrError: function() {
        this.down('image[name=errorImg]').hide();
        this.down('image[name=warnImg]').hide();
    },

    setReadOnly: function(value) {
        this.down('datetimefield').setReadOnly(value);
    }
});
