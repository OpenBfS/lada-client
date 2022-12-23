/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel to create a Numberfield
 */
Ext.define('Lada.view.widget.base.NumberField', {
    extend: 'Lada.view.widget.base.LadaField',
    alias: 'widget.numfield',

    layout: 'hbox',

    border: false,
    margin: '0, 0, 5, 0',

    warning: null,

    error: null,

    initComponent: function() {
        this.callParent(arguments);
        this.insert(0, {
            xtype: 'numberfield',
            flex: 1,
            name: this.name,
            msgTarget: 'none',
            allowDecimals: this.allowDecimals,
            decimalPrecision: this.decimalPrecision || 2,
            maxLength: this.maxLength || 1000,
            minValue: this.minValue,
            enforceMaxLength: this.enforceMaxLength || true,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            readOnly: this.readOnly || false,
            period: this.period,
            listeners: this.listeners,
            hideTrigger: this.hideTrigger || false,
            keyNavEnabled: this.keyNavEnabled || false,
            mouseWheelEnabled: this.mouseWheelEnabled || false
        });
        if (this.regex) {
            Ext.apply(this.down('numberfield'), {regex: this.regex});
        }
        if (this.allowBlank === false) {
            Ext.apply(this.down('numberfield'), {allowBlank: this.allowBlank});
        }
    },

    getValue: function() {
        return this.down('numberfield').getValue();
    },

    setValue: function(value) {
        this.down('numberfield').setValue(value);
    },

    setReadOnly: function(value) {
        this.down('numberfield').setReadOnly(value);
    }
});
