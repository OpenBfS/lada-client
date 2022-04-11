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
    extend: 'Lada.model.LadaBase',

    hasMany: [{
        model: 'Lada.model.ProbenZusatz',
        name: 'pzusatzWerts'
    }],

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
    }, {
        name: 'aktiv',
        type: 'boolean'
    }, {
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
        name: 'mehId'
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
        name: 'probenahmeMenge'
    }, {
        name: 'referenceCount',
        convert: function(value) {
            if (value === null) {
                return 0;
            }
            return value;
        }
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time',
        convert: Lada.util.Date.convertTimeFn
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
            writeAllFields: true,
            allDataOptions: {
                persist: true,
                associated: true
            }
        }
    }
});
