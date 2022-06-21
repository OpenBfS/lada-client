/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Two date pickers representing a range, with german date format.
 */
Ext.define('Lada.view.widget.base.DateRange', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.daterange',
    requires: [
        'Lada.view.widget.base.DateField'
    ],

    layout: {
        type: 'hbox',
        align: 'stretchmax'
    },
    border: false,
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [
            {
                xtype: 'label',
                text: this.fieldLabel,
                width: this.labelWidth - 30
            },
            Ext.create('Lada.view.widget.base.DateField', {
                format: this.format || 'd.m.Y',
                emptyText: i18n.getMsg('datetimepicker.chosetime'),
                fieldLabel: i18n.getMsg('from'),
                labelWidth: 30,
                margin: 5,
                width: '39%',
                name: this.name + 'From',
                readOnly: this.readOnly || false,
                period: 'start', //TODO state of this Start/End indicator?
                triggers: {
                    clear: {
                        extraCls: 'x-form-clear-trigger',
                        handler: function() {
                            this.setValue(null);
                        }
                    }
                }
            }),
            Ext.create('Lada.view.widget.base.DateField', {
                format: this.format || 'd.m.Y',
                emptyText: i18n.getMsg('datetimepicker.chosetime'),
                fieldLabel: i18n.getMsg('to'),
                labelWidth: 30,
                margin: 5,
                width: '39%',
                name: this.name + 'To',
                readOnly: this.readOnly || false,
                period: 'end', //TODO state of this Start/End indicator?
                triggers: {
                    clear: {
                        extraCls: 'x-form-clear-trigger',
                        handler: function() {
                            this.setValue(null);
                        }
                    }
                }
            })
        ];
        this.callParent(arguments);
        this.setValue(this.value);
    },
    showWarnings: function() {
        //legacy - still called?
        this.clearWarningOrError();
    },

    showErrors: function() {
        this.clearWarningOrError();
        //legacy - still called?
    },

    getValue: function() {
        var val0 = this.down('[name=' + this.name + 'From]').getValue();
        if (!val0) {
            val0 = '';
        } else {
            val0 = val0.valueOf();
        }
        var val1 = this.down('[name=' + this.name + 'To]').getValue();
        if (!val1) {
            val1 = '';
        } else {
            val1 = val1.valueOf();
        }
        if (val0 === '' && val1 === '') {
            return '';
        }
        return '' + val0 + ',' + val1;
    },

    setValue: function(value) {
        if (value && (value.indexOf(',') >= 0) ) {
            var val0 = parseInt(value.split(',')[0], 10);
            var val1 = parseInt(value.split(',')[1], 10);
            if (!isNaN(val0)) {
                this.down('[name=' + this.name + 'From]').setValue(val0);
            } else {
                this.down('[name=' + this.name + 'From]').setValue(null);
            }
            if (!isNaN(val1)) {
                this.down('[name=' + this.name + 'To]').setValue(val1);
            } else {
                this.down('[name=' + this.name + 'To]').setValue(null);
            }
        } else {
            this.down('[name=' + this.name + 'From]').setValue(null);
            this.down('[name=' + this.name + 'To]').setValue(null);
        }
    },

    clearWarningOrError: function() {
    },

    getName: function() {
        // legacy - still called?
        return this.name;
    },

    setReadOnly: function(value) {
        this.down('[name=' + this.name + 'From]').setReadOnly(value);
        this.down('[name=' + this.name + 'To]').setReadOnly(value);
    }
});
