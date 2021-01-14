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
Ext.define('Lada.view.widget.base.NumberRange', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.numrangefield',

    layout: 'hbox',

    border: false,
    margin: '0, 0, 5, 0',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var numberOptions = {
            name: this.name + 'From',
            msgTarget: 'none',
            allowDecimals: this.allowDecimals,
            decimalPrecision: this.decimalPrecision || 2,
            maxLength: this.maxLength || 1000,
            enforceMaxLength: this.enforceMaxLength || true,
            fieldLabel: i18n.getMsg('from'),
            labelWidth: 30,
            margin: 5,
            width: '38%',
            readOnly: this.readOnly || false,
            hideTrigger: this.hideTrigger || false,
            keyNavEnabled: this.keyNavEnabled || false,
            mouseWheelEnabled: this.mouseWheelEnabled || false,
            triggers: {
                clear: {
                    extraCls: 'x-form-clear-trigger',
                    handler: function() {
                        this.setValue(null);
                    }
                }
            }
        };
        var fromField = Ext.create(
            'Lada.view.form.ExpNumberField',numberOptions);

        numberOptions.name = this.name + 'To';
        numberOptions.fieldLabel = i18n.getMsg('to');
        numberOptions.margin = '5 0 5 5';
        var toField = Ext.create('Lada.view.form.ExpNumberField',numberOptions);

        this.items = [
            {
                xtype: 'label',
                text: this.fieldLabel,
                width: this.labelWidth - 30
            },
            fromField,
            toField
        ];
        this.callParent(arguments);
        if (this.regex) {
            Ext.apply(this.down('expnumberfield'), {regex: this.regex});
        }
        if (this.allowBlank === false) {
            Ext.apply(
                this.down('expnumberfield'), {allowBlank: this.allowBlank});
        }
    },

    setReadOnly: function(value) {
        this.down('[name='+this.name+'From]').setReadOnly(value);
        this.down('[name='+this.name+'To]').setReadOnly(value);
    },

    getValue: function() {
        var val0 = this.down('[name=' + this.name + 'From]').getValue();
        if (val0 === null) {
            val0 = '';
        }
        var val1 = this.down('[name='+ this.name + 'To]').getValue();
        if (val0 === null) {
            val1 = '';
        }
        if (val0 === '' && val1 === '') {
            return '';
        }
        return val0 + ',' + val1;
    },

    setValue: function(value) {
        if (value && value.indexOf(',') >= 0) {
            var val0 = parseFloat(value.split(',')[0], 10);
            var val1 = parseFloat(value.split(',')[1], 10);
            if (!isNaN(val0)) {
                this.down('[name=' + this.name + 'From]').setValue(val0);
            } else {
                this.down('[name='+ this.name + 'From]').setValue();
            }
            if (!isNaN(val1)) {
                this.down('[name='+ this.name + 'To]').setValue(val1);
            } else {
                this.down('[name='+ this.name + 'To]').setValue();
            }
        } else {
            this.down('[name=' + this.name + 'From]').setValue();
            this.down('[name=' + this.name + 'To]').setValue();
        }
    }
});
