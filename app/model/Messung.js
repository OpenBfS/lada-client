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
        convert: function(v) {
            if (!v) {
                return null;
            }
            return new Date(v);
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
        convert: function(v) {
            if (!v) {
                return new Date();
            }
            return new Date(v);
        }
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
