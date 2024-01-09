/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Sampler', {
    extend: 'Lada.model.ValidatedModel',

    fields: [{
        name: 'id'
    }, {
        name: 'networkId'
    }, {
        name: 'extId',
        type: 'nonblankstring'
    }, {
        name: 'editor',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'comm',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'descr',
        type: 'nonblankstring'
    }, {
        name: 'shortText',
        type: 'nonblankstring'
    }, {
        name: 'city',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'zip',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'inst',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'street',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'phone',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'phoneMobile',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'email',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'routePlanning',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'type',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'lastMod',
        type: 'date'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }]
});
