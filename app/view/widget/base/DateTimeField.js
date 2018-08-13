/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Datefield in order to create a
 * something like a DateTimePicker
 */
Ext.define('Lada.view.widget.base.DateTimeField', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.datetimefield',
    requires: [
        'Lada.view.widget.base.DateTimePicker'
    ],

    format: 'm/d/Y H:i',

    collapseIf: function(e) {
        var me = this;

        if (Ext.getVersion().major === 4
            && !me.isDestroyed
            && !e.within(me.bodyEl, false, true)
            && !e.within(me.picker.el, false, true)
        ) {
            me.collapse();
        }
    },

    createPicker: function() {
        var me = this;

        return new Lada.view.widget.base.DateTimePicker({
            pickerField: me,
            floating: true,
            hidden: true,
            focusable: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxDate,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            startDay: me.startDay,
            minText: Ext.String.format(me.minText, me.formatDate(me.minValue)),
            maxText: Ext.String.format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    }
});
