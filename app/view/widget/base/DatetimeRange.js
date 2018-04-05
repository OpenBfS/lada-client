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
Ext.define('Lada.view.widget.base.DatetimeRange', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datetimerange',
    requires: [
        'Lada.view.widget.base.DateTimeField'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    border: 0,
    margin: '0, 0, 5, 0',
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [
            {
                xtype: 'label',
                text: this.fieldLabel,
                width: this.labelWidth
            },
            Ext.create('Lada.view.widget.base.DateTimeField', {
                format: this.format || 'd.m.Y H:i',
                emptyText: i18n.getMsg('datetimepicker.chosetime'),
                fieldLabel: i18n.getMsg('datetimepicker.start'),
                labelWidth: 30,
                // flex: 1,
                margin: '0,5,0,5',
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
                emptyText: i18n.getMsg('datetimepicker.chosetime'),
                fieldLabel: i18n.getMsg('datetimepicker.stop'),
                labelWidth: 30,
                // flex: 1,
                margin: '0,5,0,5',
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
