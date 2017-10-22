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
        name: 'mstId'
    }, {
        name: 'laborMstId'
    }, {
        name: 'kommentar'
    }, {
        name: 'datenbasisId'
    }, {
        name: 'mplId'
    },{
        name: 'baId'
    }, {
        name: 'mediaDesk',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
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
        /* day of year is 0-base in ExtJS, but 1-based in Java.
         * Thus, we expect 1-based values here. */
        name: 'gueltigVon'
    }, {
        name: 'gueltigBis'
    }, {
        name: 'probeNehmerId'
    }, {
        name: 'probeKommentar'
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
        name: 'media',
        persist: false
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/messprogramm',
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
