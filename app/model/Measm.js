/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Measm', {
    requires: [
        'Lada.model.field.NonBlankString'
    ],
    extend: 'Lada.model.ValidatedModel',
    hasOne: 'Lada.model.StatusProt',
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
        name: 'sampleId',
        type: 'int'
    }, {
        name: 'mmtId'
    }, {
        name: 'minSampleId',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'measPd',
        type: 'int',
        allowNull: true
    }, {
        name: 'measmStartDate',
        type: 'date'
    }, {
        name: 'isCompleted',
        type: 'boolean'
    }, {
        name: 'lastMod',
        type: 'date'
    }, {
        name: 'isScheduled',
        type: 'boolean'
    }, {
        name: 'extId',
        type: 'int',
        allowNull: true
    }, {
        name: 'treeMod',
        type: 'date'
    }, {
        name: 'parentModified',
        type: 'date'
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
    }]
});
