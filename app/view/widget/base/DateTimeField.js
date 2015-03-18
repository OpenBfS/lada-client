Ext.define('Lada.view.widget.base.DateTimeField', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.datetimefield',
    requires: [
        'Lada.view.widget.base.DateTimePicker'
    ],

    format: 'm/d/Y H:i',

    mimicBlur: function(e) {
        var me = this,
        picker = me.picker;

        // ignore mousedown events within the picker element
        if (!picker ||
            !e.within(picker.el, false, true)
        ) {
            me.callParent(arguments);
        }
    },

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
            disabledDatesText: me.disabledDaysText,
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
