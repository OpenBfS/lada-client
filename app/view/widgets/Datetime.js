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
Ext.define('Lada.view.widgets.Datetime', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datetime',

    layout: 'hbox',

    border: 0,

    initComponent: function() {
        var dateField = Ext.create('Ext.ux.form.DateTimeField', {
            format: 'd.m.Y',
            emptyText: 'Wählen Sie einen Zeitpunkt',
            fieldLabel: this.fieldLabel,
            margin: this.fieldMargin,
            labelWidth: this.labelWidth,
            flex: 1,
            name: this.name,
            listeners: this.listeners
        });
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
            margin: '2, 5, 2, 5',
            width: 16,
            height: 16,
            hidden: true
        }, dateField];
        this.callParent(arguments);
    },

    showWarnings: function(warnings) {
        var img = this.down('image[name=warnImg]');
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
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
