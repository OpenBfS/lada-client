/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.DatePicker', {
    override: 'Ext.picker.Date',

    /**
     * Handle clicks on dates in the picker.
     *
     * If application is currently in utc mode: Shift date object to compensate
     * @param {Ext.event.Event} e Event
     * @param {HTMLElement} t Clicked element
     */
    handleDateClick: function(e, t) {
        var me = this,
            handler = me.handler;

        e.stopEvent();

        if (!me.disabled && t.dateValue
                && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
            var date = new Date(t.dateValue);
            date = Lada.util.Date.shiftDateObject(date);
            me.setValue(date);
            me.fireEvent('select', me, date);

            if (handler) {
                Ext.callback(handler, me.scope, [me, date], null, me, me);
            }

            // event handling is turned off on hide
            // when we are using the picker in a field
            // therefore onSelect comes AFTER the select
            // event.
            me.onSelect();
        }
    }
});
