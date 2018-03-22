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
    alias: 'widget.datetime',
    requires: [
        'Lada.view.widget.base.DateField'
    ],

    layout: {
        type: 'hbox',
        align: 'stretchmax'
    },
    border: 0,
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [
            {
                xtype: 'label',
                margin: 5,
                text: this.fieldLabel,
                width: this.labelWidth - 30
            },
            Ext.create('Lada.view.widget.base.DateField', {
                format: this.format || 'd.m.Y',
                emptyText: i18n.getMsg('datetimepicker.chosetime'),
                fieldLabel: i18n.getMsg('datetimepicker.start'),
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
                fieldLabel: i18n.getMsg('datetimepicker.stop'),
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
        this.setValue(this.value);
        this.callParent(arguments);
    },
    showWarnings: function(warnings) {
        //legacy - still called?
        this.clearWarningOrError();
    },

    showErrors: function(errors) {
        this.clearWarningOrError();
        //legacy - still called?
    },

    getValue: function() {
        return [
            this.down('datetimefield[name=dateFrom]').getValue(),
            this.down('datetimefield[name=dateTo]').getValue()];
    },

    setValue: function(value) {
        if (value && value.length == 2 ) {
            this.down('datetimefield[name=dateFrom]').setValue(value[0]);
            this.down('datetimefield[name=dateTo]').setValue(value[1]);
        }
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
