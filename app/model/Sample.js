/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Sample', {
    extend: 'Lada.model.LadaBase',

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
        name: 'extId'
    }, {
        name: 'mainSampleId',
        allowNull: true
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
        allowNull: true
    }, {
        name: 'envMediumId',
        allowNull: true
    }, {
        name: 'sampleStartDate',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'sampleEndDate',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'midSampleDate',
        type: 'int',
        allowNull: true
    }, {
        name: 'lastMod',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'datasetCreatorId',
        type: 'int',
        allowNull: true
    }, {
        name: 'samplerId',
        type: 'int',
        allowNull: true
    }, {
        name: 'stateMpgId',
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
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'schedEndDate',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'origDate',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'treeMod',
        type: 'date',
        dateFormat: 'time'
    }]
});
