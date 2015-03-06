/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.view.widget.base.TextField', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tfield',

    layout: 'hbox',

    border: 0,

    initComponent: function() {
        this.items = [{
            xtype: 'textfield',
            flex: 1,
            name: this.name,
            msgTarget: 'none',
            maxLength: this.maxLength,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            listeners: this.listeners
        }, {
            xtype: 'image',
            name: 'warnImg',
            src: 'resources/img/icon-warning.gif',
            width: 12,
            height: 12,
            hidden: true
        }, {
            xtype: 'image',
            name: 'errorImg',
            src: 'resources/img/icon-error.gif',
            width: 12,
            height: 12,
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
        img.show();
        this.down('textfield').invalidCls = 'x-lada-warning';
        this.down('textfield').markInvalid('');
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
        this.down('textfield').invalidCls = 'x-lada-error';
        this.down('textfield').markInvalid('');
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
        this.down('textfield').setReadOnly(value);
    }
});
