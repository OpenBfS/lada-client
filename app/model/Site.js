/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Site', {
    extend: 'Lada.model.LadaBase',

    requires: [
        'Lada.model.field.NonBlankString'
    ],

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'isReiActive',
        type: 'boolean',
        allowNull: true
    }, {
        name: 'extId',
        type: 'nonblankstring'
    }, {
        name: 'reiNuclFacilGrId',
        type: 'int',
        allowNull: true
    }, {
        name: 'networkId'
    }, {
        name: 'municId',
        allowNull: true
    }, {
        name: 'stateId',
        type: 'int',
        allowNull: true
    }, {
        name: 'spatRefSysId',
        type: 'int'
    }, {
        name: 'poiId',
        allowNull: true
    }, {
        name: 'siteClassId',
        type: 'int',
        allowNull: true
    }, {
        name: 'reiOprMode',
        allowNull: true
    }, {
        name: 'reiZone',
        allowNull: true
    }, {
        name: 'reiSector',
        allowNull: true
    }, {
        name: 'reiCompetence',
        allowNull: true
    }, {
        name: 'reiReportText',
        allowNull: true
    }, {
        name: 'shortText'
    }, {
        name: 'longText'
    }, {
        name: 'reiAgGrId',
        type: 'int',
        allowNull: true
    }, {
        name: 'isFuzzy',
        type: 'boolean'
    }, {
        name: 'alt',
        type: 'float'
    }, {
        name: 'heightAsl',
        type: 'float'
    }, {
        name: 'coordXExt'
    }, {
        name: 'coordYExt'
    }, {
        name: 'longitude',
        type: 'float'
    }, {
        name: 'latitude',
        type: 'float'
    }, {
        name: 'lastMod',
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
    }]
});
