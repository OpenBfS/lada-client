/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Measd', {
    requires: [
        'Lada.model.field.NonBlankString'
    ],
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'descr',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'name',
        type: 'nonblankstring'
    }, {
        name: 'defColor',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'idfExtId',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'isRefNucl',
        type: 'boolean'
    }, {
        name: 'eudfNuclId',
        type: 'int',
        allowNull: true
    }, {
        name: 'bvlFormatId',
        allowNull: true,
        type: 'nonblankstring'
    }]
});
