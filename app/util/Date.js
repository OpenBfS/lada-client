/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Utility class to handle the current timezone, date and time conversions
 * using moment.js
 */
Ext.define('Lada.util.Date', {

    statics: {
        /*
         * Toggled if time should be displayed in UTC
         */
        utc: false,

        /**
         * @private
         * Object to map ExtJS format strings on moment.js format strings
         * Format: extFormatChars: moment.js format chars
         * TODO: Complete
         */
        extFormatMap: {
            d: "DD",
            D: "ddd",
            j: "D",
            l: "dddd",
            F: "MMMM",
            m: "MM",
            M: "MMM",
            n: "M",
            Y: "Y",
            y: "YY",
            g: "h",
            G: "k",
            h: "hh",
            H: "HH",
            i: "mm",
            s: "ss",
            O: "ZZ",
            P: "Z",
            Z: 'zz'
        },

        /**
         * Create a time string from a timestamp using the defined format
         * @param {Number} timestamp Unix timestamp to use
         * @param {String} format Format string to use
         * @param {Boolean} extFormat True if format string is a ExtJS format,
         *                            false if format is a moment.js format string
         *                            Defaults to false
         * @return {String} Formatted time string
         */
        formatTimestamp: function(timestamp, format, extFormat) {
            if (!moment || !moment.tz) {
                console.error('dependencies moment.js and/or moment-timezone are not found');
            }
            var me = this;
            var timezone = this.utc? 'UTC': moment.tz.guess();
            var date = moment(timestamp);
            if (extFormat) {
                var converted = [];
                format.split('').forEach(function(char) {
                    converted.push(me.extFormatMap[char]? me.extFormatMap[char]: char);
                });
                format = converted.join('');
            }
            return date.tz(timezone).format(format);
        },

        /**
         * Set the display time zone to utc or local time
         * @param {Boolean} utc True if time shall be displayed in UTC, else false
         */
        setUTCDisplay: function(utc) {
            if (utc != null) {
                this.utc = utc;
            }
        },

        /**
         * Returns the timezone currently used as diaplay base
         * (e.g. to be used used for print templates)
         */
        getCurrentTimeZone: function() {
            return this.utc? 'UTC': moment.tz.guess();
        },

        /**
         * "Shifts" a date. If the client is set to "UTC display", but the
         * dates used internally are in another timezone, the dates will be
         * shifted according to the utc offset.
         * TODO: this is hackish and relies on ExtJS *always* using local time
         * @param {*} date
         */
        shiftDateObject: function(date) {
            if (!Lada.util.Date.utc) {
                return date;
            } else {
                var tz = moment.tz.guess();
                var offset = moment.tz.zone(tz).utcOffset(date.valueOf());
                return new Date(date.valueOf() + offset * 60000);
            }
        },

        /**
         * centralized 'convert' function for time-based model entries.
         * @param {*} v
         */
        convertTimeFn: function(v) {
            if (!v) {
                return null;
            }
            v = new Date(v);
            if (!Lada.util.Date.utc) {
                return new Date(v);
            } else {
                // see shiftDateObject description
                var momentzone = moment.tz.zone(moment.tz.guess());
                var offset = momentzone.utcOffset(v) * 60000;
                return new Date(v.valueOf() - offset);
                // TODO check direction of shift
            }
        },

        /**
         * centralized 'convert' function for time-based model entries with
         * defaults set to 'now'
         * @param {*} v
         */
        convertTimeFnDefaultNow: function(v) {
            var date = v ? new Date(v): new Date();
            if (!Lada.util.Date.utc) {
                return date;
            } else {
                // see shiftDateObject description
                var momentzone = moment.tz.zone(moment.tz.guess());
                var offset = momentzone.utcOffset(v) * 60000;
                return new Date(v.valueOf() - offset);
                // TODO check direction of shift
            }
        }
    }
});
