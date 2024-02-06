/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.SampleSpecifMeasVal', {
    requires: [
        'Lada.model.field.NonBlankString'
    ],
    extend: 'Lada.model.ValidatedModel',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'sampleId',
        type: 'int'
    }, {
        name: 'sampleSpecifId'
    }, {
        name: 'smallerThan',
        convert: function(v) {
            if (!v) {
                return null;
            }
            return '<';
        },
        type: 'nonblankstring'
    }, {
        name: 'measVal',
        type: 'float',
        allowNull: true
    }, {
        name: 'error',
        type: 'float',
        allowNull: true
    }, {
        name: 'lastMod',
        type: 'date'
    }, {
        name: 'treeMod',
        type: 'date'
    }, {
        name: 'parentModified',
        type: 'date'
    }]
});
