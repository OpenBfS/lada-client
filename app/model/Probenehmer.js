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
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'prnId'
    }, {
        name: 'bearbeiter',
        allowNull: true
    }, {
        name: 'bemerkung',
        allowNull: true
    }, {
        name: 'bezeichnung'
    }, {
        name: 'kurzBezeichnung'
    }, {
        name: 'ort',
        allowNull: true
    }, {
        name: 'plz',
        allowNull: true
    }, {
        name: 'betrieb',
        allowNull: true
    }, {
        name: 'strasse',
        allowNull: true
    }, {
        name: 'telefon',
        allowNull: true
    }, {
        name: 'tourenplan',
        allowNull: true
    }, {
        name: 'typ',
        allowNull: true
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time'
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
