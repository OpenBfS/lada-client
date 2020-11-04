/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Two datetime pickers representing a range, with german date format.
 */
Ext.define('Lada.view.widget.base.DateTimeRange', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datetimerange',
    requires: [
        'Lada.view.widget.base.DateTimeField'
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
                width: this.labelWidth - 55,
                border: false
            },
            Ext.create('Lada.view.widget.base.DateTimeField', {
                format: this.format || 'd.m.Y H:i',
                formatText: '',
                emptyText: i18n.getMsg('datetimepicker.chosetime'),
                fieldLabel: i18n.getMsg('from'),
                labelWidth: 22,
                flex: 1,
                margin: '5,0,5,0',
                border: false,
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
            Ext.create('Lada.view.widget.base.DateTimeField', {
                format: this.format || 'd.m.Y H:i',
                formatText: '',
                emptyText: i18n.getMsg('datetimepicker.chosetime'),
                fieldLabel: i18n.getMsg('to'),
                labelWidth: 20,
                flex: 1,
                margin: '5,0,5,0',
                border: false,
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
        this.setValue(this.value);
        Ext.on('timezonetoggled', function() {
            this.setValue(this.getValue());
        }, this);
        this.callParent(arguments);
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
                this.down('[name=' + this.name + 'From]').setValue(new Date(val0));
            } else {
                this.down('[name=' + this.name + 'From]').setValue(null);
            }
            if (!isNaN(val1)) {
                this.down('[name=' + this.name + 'To]').setValue(new Date(val1));
            } else {
                this.down('[name=' + this.name + 'To]').setValue(null);
            }
        }
    },

    clearValue: function() {
        this.down('[name=' + this.name + 'From]').setValue(null);
        this.down('[name=' + this.name + 'To]').setValue(null);
    },

    clearWarningOrError: function() {
        // legacy - still called?
        this.down('datetimefield').clearInvalid();
    },

    getName: function() {
        // legacy - still called?
        return this.name;
    },

    setReadOnly: function(value) {
        this.down('datetimefield[name=dateFrom]').setReadOnly(value);
        this.down('datetimefield[name=dateTo]').setReadOnly(value);
    }
});
