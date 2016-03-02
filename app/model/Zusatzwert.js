/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Zusatzwerte
 */
Ext.define('Lada.model.Zusatzwert', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'probeId'
    }, {
        name: 'pzsId'
    }, {
        name: 'nwgZuMesswert',
        serialize: function(v) {
            if (v.indexOf(',') > 0) {
                v = v.replace(',', '.');
                return v;
            }
            return v;
        },
        convert: function(value) {
            if (!value || value === '') {
                return value;
            }
            var valueString = value.toString();
            if (valueString.indexOf('E') > 0) {
                valueString = valueString.replace('E', 'e');
            }
            var tmp;
            if (valueString.indexOf('e') > 0) {
                tmp = valueString;
            }
            else {
                // Currently not locale friendly...
                if (valueString.indexOf(',') > 0) {
                    valueString = valueString.replace(',', '.');
                }
                tmp = parseFloat(valueString).toExponential();
            }
            var parts = tmp.split('e');
            if (parts[0].indexOf('.') > 0) {
                var floatPart = parseFloat(parts[0]);
                parts[0] = floatPart.toLocaleString();
            }
            return parts[0] + 'e' + parts[1];
        }
    }, {
        name: 'messwertPzs',
        serialize: function(v) {
            if (v.indexOf(',') > 0) {
                v = v.replace(',', '.');
                return v;
            }
            return v;
        },
        convert: function(value) {
            if (!value || value === '') {
                return value;
            }
            var valueString = value.toString();
            if (valueString.indexOf('E') > 0) {
                valueString = valueString.replace('E', 'e');
            }
            var tmp;
            if (valueString.indexOf('e') > 0) {
                tmp = valueString;
            }
            else {
                // Currently not locale friendly...
                if (valueString.indexOf(',') > 0) {
                    valueString = valueString.replace(',', '.');
                }
                tmp = parseFloat(valueString).toExponential();
            }
            var parts = tmp.split('e');
            if (parts[0].indexOf('.') > 0) {
                var floatPart = parseFloat(parts[0]);
                parts[0] = floatPart.toLocaleString();
            }
            return parts[0] + 'e' + parts[1];
        }
    }, {
        name: 'messfehler',
        type: 'float'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        defaultValue: new Date()
    }, {
        name: 'treeModified',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'parentModified',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/zusatzwert',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
