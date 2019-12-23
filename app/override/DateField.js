/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.Date', {
    override: 'Ext.form.field.Date',

    // TODO: not yet fully tested
    formatDate: function(date, format) {
        if (Ext.isDate(date)) {
            if (!format) {
                format = this.format;
            }
            return Lada.util.Date.formatTimestamp(date.valueOf(), format, true);
        }
        return date;
    },
    valueToRaw: function(val) {
        if (!val) {
            return '';
        }
        return Lada.util.Date.formatTimestamp(val.valueOf(), this.format, true);
    }
});
