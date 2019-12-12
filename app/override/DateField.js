/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.Date', {
    override: 'Ext.form.field.Date',

    /**
     * Overrides internal parsing of dates to account for the desired time zone
     * display according to Lada.util.Date
     * @param {*} value
     */
    parseDate: function(value) {
        if (!value) {
            return value;
        }
        if (Ext.isDate(value)) {
            return Lada.util.Date.shiftDateObject(value);
        }
        var me = this,
            val = me.safeParse(value, me.format),
            altFormats = me.altFormats,
            altFormatsArray = me.altFormatsArray,
            i = 0,
            len;

        if (!val && altFormats) {
            altFormatsArray = altFormatsArray || altFormats.split('|');
            len = altFormatsArray.length;
            for (; i < len && !val; ++i) {
                val = me.safeParse(value, altFormatsArray[i]);
            }
        }
        val = Lada.util.Date.shiftDateObject(val);
        return val;
    },

    // TODO: not yet fully tested
    formatDate: function(date, format) {
        if (Ext.isDate(date)) {
            if (!format) {
                format = this.format;
            }
            return Lada.util.Date.formatTimestamp(date.valueOf(), format, true);
        }
        return date;
    }
});
