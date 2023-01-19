/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Ort Stammdaten
 */
Ext.define('Lada.model.Ort', {
    extend: 'Lada.model.LadaBase',

    requires: [
        'Lada.model.field.NonBlankString'
    ],

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'aktiv',
        type: 'boolean',
        allowNull: true
    }, {
        name: 'ortId',
        type: 'nonblankstring'
    }, {
        name: 'ktaGruppeId',
        type: 'int',
        allowNull: true
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'gemId',
        allowNull: true
    }, {
        name: 'staatId',
        type: 'int',
        allowNull: true
    }, {
        name: 'kdaId',
        type: 'int',
        allowNull: true
    }, {
        name: 'ozId',
        allowNull: true
    }, {
        name: 'ortTyp',
        type: 'int',
        allowNull: true
    }, {
        name: 'mpArt',
        allowNull: true
    }, {
        name: 'zone',
        allowNull: true
    }, {
        name: 'sektor',
        allowNull: true
    }, {
        name: 'zustaendigkeit',
        allowNull: true
    }, {
        name: 'berichtstext',
        allowNull: true
    }, {
        name: 'kurztext'
    }, {
        name: 'langtext'
    }, {
        name: 'reiProgpunktGrpId',
        type: 'int',
        allowNull: true
    }, {
        name: 'unscharf',
        type: 'boolean'
    }, {
        name: 'hoeheLand',
        type: 'float'
    }, {
        name: 'hoeheUeberNn',
        type: 'float'
    }, {
        name: 'koordXExtern'
    }, {
        name: 'koordYExtern'
    }, {
        name: 'longitude',
        type: 'float'
    }, {
        name: 'latitude',
        type: 'float'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'referenceCount',
        type: 'int'
    }, {
        name: 'plausibleReferenceCount',
        type: 'int'
    }, {
        name: 'referenceCountMp',
        type: 'int'
    }, {
        name: 'readonly',
        type: 'boolean'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/ort',
        timeout: 60000,
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
