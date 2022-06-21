/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for DatensatzErzeuger Stammdaten
 */
Ext.define('Lada.model.DatensatzErzeuger', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'datensatzErzeugerId'
    }, {
        name: 'mstId'
    }, {
        name: 'bezeichnung'
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
        url: 'lada-server/rest/datensatzerzeuger',
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
