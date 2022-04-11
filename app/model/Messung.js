/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Messungen
 */
Ext.define('Lada.model.Messung', {
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
        name: 'statusEdit',
        type: 'boolean',
        persist: false
    }, {
        name: 'probeId'
    }, {
        name: 'mmtId'
    }, {
        name: 'nebenprobenNr'
    }, {
        name: 'messdauer'
    }, {
        name: 'messzeitpunkt',
        type: 'date',
        convert: Lada.util.Date.convertTimeFn,
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'status'
    }, {
        name: 'fertig',
        type: 'boolean'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time',
        convert: Lada.util.Date.convertTimeFnDefaultNow
    }, {
        name: 'geplant',
        type: 'boolean'
    }, {
        name: 'externeMessungsId'
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
    }, {
        name: 'statusWert',
        persist: false
    }, {
        name: 'statusStufe',
        persist: false
    }, {
        name: 'statuskombi',
        persist: false
    }, {
        name: 'messwerteCount',
        persist: false
    }, {
        name: 'kommentarCount',
        persist: false
    }, {
        name: 'copyOfMessungId',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/messung',
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
