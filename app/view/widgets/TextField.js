/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.view.widgets.TextField', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tfield',

    layout: 'hbox',

    border: 0,

    initComponent: function() {
        this.items = [{
            xtype: 'image',
            name: 'warnImg',
            src: 'gfx/icon-warning.gif',
            margin: '2, 5, 2, 5',
            width: 16,
            height: 16,
            hidden: true
        }, {
            xtype: 'image',
            name: 'errorImg',
            src: 'gfx/icon-error.gif',
            width: 16,
            height: 16,
            margin: '2, 5, 2, 5',
            hidden: true
        }, {
            xtype: 'textfield',
            flex: 1,
            name: this.name,
            maxLength: this.maxLength,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            listeners: this.listeners
        }];
        this.callParent(arguments);
    },

    showWarnings: function(warnings) {
        var img = this.down('image[name=warnImg]');
        var field = this.down('textfield');
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
        field.setLabelWidth(field.labelWidth - 18);
        img.show();
    },

    showErrors: function(errors) {
        var img = this.down('image[name=errorImg]');
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: errors
        });
        img.show();
    }
});
