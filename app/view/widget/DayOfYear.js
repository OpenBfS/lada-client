/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Panel to select month and day of month,
 * that can be serialized to day of year
 */
Ext.define('Lada.view.widget.DayOfYear', {
    extend: 'Lada.view.widget.base.LadaField',
    alias: 'widget.dayofyear',

    layout: {
        type: 'hbox',
        pack: 'end'
    },

    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var monthsStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [{
                'id': 0,
                'name': 'Januar'
            }, {
                'id': 1,
                'name': 'Februar'
            }, {
                'id': 2,
                'name': 'März'
            }, {
                'id': 3,
                'name': 'April'
            }, {
                'id': 4,
                'name': 'Mai'
            }, {
                'id': 5,
                'name': 'Juni'
            }, {
                'id': 6,
                'name': 'Juli'
            }, {
                'id': 7,
                'name': 'August'
            }, {
                'id': 8,
                'name': 'September'
            }, {
                'id': 9,
                'name': 'Oktober'
            }, {
                'id': 10,
                'name': 'November'
            }, {
                'id': 11,
                'name': 'Dezember'
            }]
        });

        /*
         * Create hidden field to hold the day of year value
         * for/of the record of the form.
         */
        var DOYField = Ext.create('Ext.form.field.Number', {
            name: this.name,
            hidden: true,
            allowBlank: this.allowBlank,
            listeners: this.listeners
        });
        /* Use dirtychange to avoid endless loop with change listeners on
         * visible items. This one is for initialisation by the form. */
        DOYField.addListener('dirtychange', me.setFields);
        DOYField.addListener('validitychange', me.validityChange);

        /*
         * Add hidden field and visible fields to let the user choose
         * day and month to the panel.
         */
        this.callParent(arguments);
        this.insert(0, DOYField);
        this.insert(1, {
            xtype: 'numberfield',
            isFormField: false,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            width: 60 + this.labelWidth,
            margin: '0 6 0 0',
            msgTarget: 'none',
            allowDecimals: false,
            maxLength: 2,
            enforceMaxLength: true,
            allowBlank: this.allowBlank,
            minValue: 1,
            maxValue: 31,
            emptyText: i18n.getMsg('day'),
            listeners: {
                /* we have to listen on change because checkMaxDay() might
                 * change the value. UI events like blur do not track this. */
                change: { fn: me.setDOY }
            }
        });
        this.insert(2, {
            xtype: 'combobox',
            isFormField: false,
            width: 120,
            msgTarget: 'none',
            store: monthsStore,
            allowBlank: this.allowBlank,
            forceSelection: true,
            valueField: 'id',
            displayField: 'name',
            emptyText: i18n.getMsg('month'),
            queryMode: 'local',
            listeners: {
                collapse: { fn: me.setDOY },
                change: { fn: me.checkMaxDay }
            }
        });
        this.down('combobox').getTriggers().clear.hidden = true;
    },

    /*
     * Set values in panel items for day and month
     * from hidden day of year field
     */
    setFields: function() {
        var panel = this.up('panel');

        // create a date object with arbitrary non-leap year
        var doy = panel.down('numberfield[hidden]').getValue();

        if (doy !== null) {
            // day of year is 0-based in ExtJS, but 1-based in the model
            doy -= 1;
            var date = Ext.Date.subtract(
                new Date(1970, 0, 1), Ext.Date.DAY, -doy);
            var month = date.getMonth();
            var day = date.getDate();
            panel.down('combobox').setValue(month);
            panel.down('numberfield[hidden=false]').setValue(day);
        }
    },

    /*
     * Function to be called from listeners of visible items
     * to set the value of the hidden day of year field.
     */
    setDOY: function() {
        var panel = this.up('panel');
        var month = panel.down('combobox').getValue();
        var day = panel.down('numberfield[hidden=false]').getValue();
        var maxDay = panel.down('numberfield[hidden=false]').maxValue;
        var doy = null;

        if (month !== null && day !== null && day <= maxDay) {
            // create a date object with arbitrary non-leap year
            var date = new Date(1970, month, day);

            // day of year is 0-based in ExtJS, but 1-based in the model
            doy = Ext.Date.getDayOfYear(date) + 1;
        }
        panel.down('numberfield[hidden]').setValue(doy);
    },

    /*
     * Call from listener of month selection widget to set maximum and
     * validate associated day value.
     */
    checkMaxDay: function() {
        // create a date object with arbitrary non-leap year
        var maxDay = Ext.Date.getDaysInMonth(
            new Date(1970, this.getValue()));
        this.up('panel').down('numberfield[hidden=false]')
            .setMaxValue(maxDay);

        var curDay = this.up('panel')
            .down('numberfield[hidden=false]').getValue();
        if (curDay) {
            if (curDay > maxDay) {
                this.up('panel').down('numberfield[hidden=false]')
                    .setValue(maxDay);
            }
            this.up('panel').down('numberfield[hidden=false]')
                .clearInvalid();
        }
    },


    /*
     * When the hidden field is validated as part of a form, make the result
     * user visible.
     */
    validityChange: function(field, isValid) {
        if (!isValid) {
            var errors = field.getActiveErrors();
            field.up('panel').down('combobox').markInvalid(errors);
            field.up('panel').down('numberfield[hidden=false]')
                .markInvalid(errors);
        } else {
            field.up('panel').down('combobox').clearInvalid();
            field.up('panel').down('numberfield[hidden=false]').clearInvalid();
        }
    },

    getValue: function() {
        this.down('numberfield[hidden]').getValue();
    },

    setValue: function(value) {
        this.down('numberfield[hidden]').setValue(value);
    },

    setReadOnly: function(value) {
        this.down('numberfield[hidden=false]').setReadOnly(value);
        this.down('combobox').setReadOnly(value);
    }
});
