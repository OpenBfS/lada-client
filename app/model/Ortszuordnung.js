/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Ortszuordnung of probe
 */
Ext.define('Lada.model.Ortszuordnung', {
    extend: 'Lada.model.LadaBase',

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
        name: 'ortId'
    }, {
        name: 'probeId'
    }, {
        name: 'ortszuordnungTyp'
    }, {
        name: 'ortszusatztext'
    }, {
        name: 'ozId'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time',
        convert: Lada.util.Date.convertTimeFn
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
        url: 'lada-server/rest/ortszuordnung',
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
