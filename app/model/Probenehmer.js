/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Probenehmer Stammdaten
 */
Ext.define('Lada.model.Probenehmer', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'prnId'
    }, {
        name: 'bearbeiter'
    }, {
        name: 'bemerkung'
    }, {
        name: 'bezeichnung'
    }, {
        name: 'kurzBezeichnung'
    }, {
        name: 'ort'
    }, {
        name: 'plz'
    }, {
        name: 'betrieb'
    }, {
        name: 'strasse'
    }, {
        name: 'telefon'
    }, {
        name: 'tp'
    }, {
        name: 'typ'
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
        name: 'readonly',
        type: 'boolean',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/probenehmer',
        reader: {
            type: 'json',
            totalProperty: 'totalCount',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});
