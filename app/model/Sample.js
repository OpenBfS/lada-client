/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Sample', {
    extend: 'Lada.model.ValidatedModel',

    requires: [
        'Lada.model.field.NonBlankString'
    ],

    /**
     * Save original record if sample is a copy of another
     */
    copiedFrom: null,

    fields: [{
        name: 'id',
        allowNull: true
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'extId',
        type: 'nonblankstring'
    }, {
        name: 'mainSampleId',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'isTest',
        type: 'boolean'
    }, {
        name: 'measFacilId'
    }, {
        name: 'apprLabId'
    }, {
        name: 'regulationId',
        type: 'int',
        allowNull: true
    }, {
        name: 'oprModeId',
        type: 'int',
        allowNull: true
    }, {
        name: 'sampleMethId',
        type: 'int',
        allowNull: true
    }, {
        name: 'envDescripDisplay',
        type: 'nonblankstring',
        allowNull: true
    }, {
        name: 'envDescripName',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'envMediumId',
        allowNull: true
    }, {
        name: 'sampleStartDate',
        type: 'date'
    }, {
        name: 'sampleEndDate',
        type: 'date'
    }, {
        name: 'midSampleDate',
        type: 'int',
        allowNull: true
    }, {
        name: 'lastMod',
        type: 'date'
    }, {
        name: 'datasetCreatorId',
        type: 'int',
        allowNull: true
    }, {
        name: 'samplerId',
        type: 'int',
        allowNull: true
    }, {
        name: 'mpgCategId',
        type: 'int',
        allowNull: true
    }, {
        name: 'mpgId',
        type: 'int',
        allowNull: true
    }, {
        name: 'reiAgGrId',
        type: 'int',
        allowNull: true
    }, {
        name: 'nuclFacilGrId',
        type: 'int',
        allowNull: true
    }, {
        name: 'schedStartDate',
        type: 'date'
    }, {
        name: 'schedEndDate',
        type: 'date'
    }, {
        name: 'origDate',
        type: 'date'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'treeMod',
        type: 'date'
    }]
});
