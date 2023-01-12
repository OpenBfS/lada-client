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
    extend: 'Lada.view.widget.base.LadaField',
    alias: 'widget.datetime',
    requires: [
        'Lada.view.widget.base.DateTimeField'
    ],

    layout: 'hbox',
    tooltip: null,
    border: false,

    margin: '0, 0, 5, 0',

    initComponent: function() {
        this.callParent(arguments);
        var dateField = Ext.create('Lada.view.widget.base.DateTimeField', {
            format: this.format || 'd.m.Y H:i',
            emptyText: this.emptyText || 'd.m.Y H:i',
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            flex: 1,
            name: this.name,
            msgTarget: 'none',
            listeners: this.listeners,
            readOnly: this.readOnly || false,
            period: this.period,
            value: this.value,
            formatText: this.formatText
        });
        this.insert(0, dateField);
        Ext.on('timezonetoggled', function() {
            // trigger a 'refresh' of the displayed rawValue (bypassing the
            // isDirty change detection)
            var val = this.getValue();
            if (!val) {
                return;
            }
            this.down('datetimefield').setRawValue(
                Lada.util.Date.formatTimestamp(val.valueOf(), this.format, true)
            );
        }, this);
    },

    getValue: function() {
        return this.down('datetimefield').getValue();
    },

    setValue: function(value) {
        this.down('datetimefield').setValue(value);
    },

    getName: function() {
        return this.name;
    },

    setReadOnly: function(value) {
        this.down('datetimefield').setReadOnly(value);
    }
});
