/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Ortszuordnung of Messprogramme
 */
Ext.define('Lada.model.OrtszuordnungMp', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'ortId'
    }, {
        name: 'messprogrammId'
    }, {
        name: 'ortszuordnungTyp'
    }, {
        name: 'ortszusatztext'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        }
    }, {
        name: 'treeModified',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'copyOf',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/ortszuordnungmp',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});

