/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

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

/**
 * Panel to select month and day of month,
 * that can be serialized to day of year
 */
Ext.define('Lada.view.widget.DayOfYear', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dayofyear',

    layout: {
        type: 'hbox',
        pack: 'end',
        defaultMargins: '3'
    },

    initComponent: function() {
        var me = this;

        /*
         * Create hidden field to hold the day of year value
         * for/of the record of the form.
         */
        var DOYField = Ext.create('Ext.form.field.Number', {
            name: this.name,
            hidden: true,
            listeners: this.listeners
        });
        /* Use dirtychange to avoid endless loop with change listeners on
         * visible items. This one is for initialisation by the form. */
        DOYField.addListener('dirtychange', me.setFields);

        /*
         * Add hidden field and visible fields to let the user choose
         * day and month to the panel.
         */
        this.items = [{
            xtype: 'numberfield',
            isFormField: false,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            width: 50 + this.labelWidth,
            msgTarget: 'none',
            allowDecimals: false,
            maxLength: 2,
            enforceMaxLength: true,
            allowBlank: this.allowBlank,
            minValue: 1,
            maxValue: 31,
            emptyText: 'Tag',
            listeners: {
                /* we have to listen on change because checkMaxDay() might
                 * change the value. UI events like blur do not track this. */
                change: { fn: me.setDOY }
            }
        }, {
            xtype: 'combobox',
            isFormField: false,
            width: 100,
            msgTarget: 'none',
            store: monthsStore,
            allowBlank: this.allowBlank,
            forceSelection: true,
            valueField: 'id',
            displayField: 'name',
            emptyText: 'Monat',
            queryMode: 'local',
            listeners: {
                collapse: { fn: me.setDOY },
                change: { fn: me.checkMaxDay }
            }
        }, {
            xtype: 'image',
            name: 'warnImg',
            src: 'resources/img/dialog-warning.png',
            width: 14,
            height: 14,
            hidden: true
        }, {
            xtype: 'image',
            name: 'errorImg',
            src: 'resources/img/emblem-important.png',
            width: 14,
            height: 14,
            hidden: true
        }, DOYField];

        this.callParent(arguments);
    },

    /*
     * Set values in panel items for day and month
     * from hidden day of year field
     */
    setFields: function() {
        var panel = this.up('panel');

        // create a date object with arbitrary non-leap year
        var doy = panel.down('numberfield[hidden]').getValue();

        if (doy != null) {
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

        if (month != null && day != null && day <= maxDay) {
            // create a date object with arbitrary non-leap year
            var date = new Date(1970, month, day);
            var doy = Ext.Date.getDayOfYear(date);
            panel.down('numberfield[hidden]').setValue(doy);
        }
    },

    /*
     * Call from listener of month selection widget to set maximum and
     * validate associated day value.
     */
    checkMaxDay: function() {
        this.up('panel').down('numberfield[hidden=false]')
            .clearInvalid();

        // create a date object with arbitrary non-leap year
        var maxDay = Ext.Date.getDaysInMonth(
            new Date(1970, this.getValue()));
        this.up('panel').down('numberfield[hidden=false]')
            .setMaxValue(maxDay);

        var curDay = this.up('panel')
            .down('numberfield[hidden=false]').getValue();
        if (curDay > maxDay) {
            this.up('panel').down('numberfield[hidden=false]')
                .setValue(maxDay);
        }
    },


    showWarnings: function(warnings) {
        var img = this.down('image[name=warnImg]');
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
        img.show();
        this.down('numberfield[hidden=false]').invalidCls = 'x-lada-warning';
        this.down('numberfield[hidden=false]').markInvalid('');
        this.down('combobox').markInvalid('');
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var warningText = i18n.getMsg(this.name) + ': ' + warnings;
            fieldset.showWarningOrError(true, warningText);
        }
    },

    showErrors: function(errors) {
        var img = this.down('image[name=errorImg]');
        var warnImg = this.down('image[name=warnImg]');
        warnImg.hide();
        Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: errors
        });
        this.down('numberfield[hidden=false]').invalidCls = 'x-lada-error';
        this.down('numberfield[hidden=false]').markInvalid('');
        this.down('combobox').markInvalid('');
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var errorText = i18n.getMsg(this.name) + ': ' + errors;
            fieldset.showWarningOrError(false, '', true, errorText);
        }
    },

    clearWarningOrError: function() {
        this.down('image[name=errorImg]').hide();
        this.down('image[name=warnImg]').hide();
    },

    getValue: function() {
        this.down('numberfield[hidden]').getValue();
    },

    setValue: function(value) {
        this.down('numberfield[hidden]').setValue(value);
    }
});
