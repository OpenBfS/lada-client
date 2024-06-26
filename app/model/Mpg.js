/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Mpg', {
    extend: 'Lada.model.ValidatedModel',

    requires: [
        'Lada.model.field.NonBlankString'
    ],

    hasMany: 'SampleSpecif',

    fields: [{
        name: 'id'
    }, {
        name: 'isTest',
        type: 'boolean'
    }, {
        name: 'measFacilId'
    }, {
        name: 'apprLabId'
    }, {
        name: 'commMpg',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'regulationId',
        type: 'int'
    }, {
        name: 'mpgCategId',
        type: 'int',
        allowNull: true
    }, {
        name: 'isActive',
        type: 'boolean'
    }, {
        name: 'oprModeId',
        type: 'int',
        allowNull: true
    }, {
        name: 'envDescripDisplay',
        type: 'nonblankstring',
        allowNull: true
    }, {
        name: 'envMediumId',
        allowNull: true
    }, {
        name: 'measUnitId',
        type: 'int',
        allowNull: true
    }, {
        name: 'sampleMethId',
        type: 'int'
    }, {
        name: 'samplePd',
        type: 'nonblankstring',
        allowNull: false
    }, {
        name: 'samplePdStartDate',
        type: 'int'
    }, {
        name: 'samplePdEndDate',
        type: 'int'
    }, {
        name: 'samplePdOffset',
        type: 'int'
    }, {
        /* day of year is 0-base in ExtJS, but 1-based in Java.
         * Thus, we expect 1-based values here. */
        name: 'validStartDate',
        type: 'int'
    }, {
        name: 'ValidEndDate',
        type: 'int'
    }, {
        name: 'samplerId',
        type: 'int',
        allowNull: true
    }, {
        name: 'commSample',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'sampleQuant',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'referenceCount',
        type: 'int'
    }, {
        name: 'lastMod',
        type: 'date'
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
    }]
});
