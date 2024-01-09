/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Site', {
    extend: 'Lada.model.ValidatedModel',

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
        name: 'nuclFacilGrId',
        type: 'int',
        allowNull: true
    }, {
        name: 'networkId'
    }, {
        name: 'adminUnitId',
        allowNull: true
    }, {
        name: 'stateId',
        type: 'int',
        allowNull: true
    }, {
        name: 'spatRefSysId',
        type: 'int',
        allowNull: true
    }, {
        name: 'poiId',
        allowNull: true
    }, {
        name: 'siteClassId',
        type: 'int',
        allowNull: true
    }, {
        name: 'reiOprMode',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'reiZone',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'reiSector',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'reiCompetence',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'reiReportText',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'shortText',
        type: 'nonblankstring'
    }, {
        name: 'longText',
        type: 'nonblankstring'
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
        name: 'coordXExt',
        type: 'nonblankstring'
    }, {
        name: 'coordYExt',
        type: 'nonblankstring'
    }, {
        name: 'longitude',
        type: 'float'
    }, {
        name: 'latitude',
        type: 'float'
    }, {
        name: 'lastMod',
        type: 'date'
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
