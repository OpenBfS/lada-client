/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A Messprogramm.
 * This class represents and defines the model of a 'Messprogramm'
 **/
Ext.define('Lada.model.Messprogramm', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'test',
        type: 'boolean'
    }, {
        name: 'netzbetreiberId',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'mstId'
    }, {
        name: 'laborMstId'
    }, {
        name: 'name'
    }, {
        name: 'datenbasisId'
    }, {
        name: 'baId'
    }, {
        name: 'gemId'
    }, {
        name: 'ortId'
    }, {
        name: 'mediaDesk'
    }, {
        name: 'umwId',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'probenartId'
    }, {
        name: 'probenintervall'
    }, {
        name: 'teilintervallVon'
    }, {
        name: 'teilintervallBis'
    }, {
        name: 'intervallOffset'
    }, {
        name: 'gueltigVon',
        type: 'date',
        convert: function(v) {
            var firstofyeartimestamp = new Date(
                Date.UTC(
                    new Date().getFullYear(),0,1))
                .valueOf();
            var dayToMilli = 86400000;

            if (!v) {
                return v;
            }
            //check if v might be a date
            // unless we go back in time this will work
            if (v < 1000) {
                v = v * dayToMilli;
                v = v + firstofyeartimestamp;
                v = new Date(v);
            }
            return v;
        },
        serialize: function(value) {
            if (value instanceof Date && !isNaN(value.valueOf())) {
                var dayOfYear = Ext.Date.getDayOfYear(value);
                var offset = value.getTimezoneOffset();
                if (offset == 0) {
                    return dayOfYear;
                }
                return offset > 0 ? dayOfYear - 1 : dayOfYear + 1;
            }
        }
    }, {
        name: 'gueltigBis',
        type: 'date',
        convert: function(v) {
            var firstofyeartimestamp = new Date(
                Date.UTC(
                    new Date().getFullYear(),0,1))
                .valueOf();
            var dayToMilli = 86400000;

            if (!v) {
                return v;
            }

            //check if v might be a date
            // unless we go back in time this will work
            if (v < 1000) {
                v = v * dayToMilli;
                v = v + firstofyeartimestamp;
                v = new Date(v);
            }
            return v;
        },
        serialize: function(value) {
            if (value instanceof Date && !isNaN(value.valueOf())) {
                var dayOfYear = Ext.Date.getDayOfYear(value);
                var offset = value.getTimezoneOffset();
                if (offset == 0) {
                    return dayOfYear;
                }
                return offset > 0 ? dayOfYear - 1 : dayOfYear + 1;
            }
        }
    }, {
        name: 'probeNehmerId'
    }, {
        name: 'probeKommentar'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        }
    }, {
        name: 'media',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/messprogramm',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
