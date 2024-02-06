/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.AdminUnit', {
    requires: [
        'Lada.model.field.NonBlankString'
    ],
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'stateId',
        type: 'nonblankstring'
    }, {
        name: 'ruralDistId',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'govDistId',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'name',
        type: 'nonblankstring'
    }, {
        name: 'isState',
        type: 'boolean'
    }, {
        name: 'isMunic',
        type: 'boolean'
    }, {
        name: 'isRuralDist',
        type: 'boolean'
    }, {
        name: 'isGovDist',
        type: 'boolean'
    }, {
        name: 'zip',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'longitude',
        type: 'float',
        allowNull: true
    }, {
        name: 'latitude',
        type: 'float',
        allowNull: true
    }]
});
