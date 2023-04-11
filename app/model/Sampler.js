/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Sampler', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'networkId'
    }, {
        name: 'extId'
    }, {
        name: 'editor',
        allowNull: true
    }, {
        name: 'comm',
        allowNull: true
    }, {
        name: 'descr'
    }, {
        name: 'shortText'
    }, {
        name: 'city',
        allowNull: true
    }, {
        name: 'zip',
        allowNull: true
    }, {
        name: 'inst',
        allowNull: true
    }, {
        name: 'street',
        allowNull: true
    }, {
        name: 'phone',
        allowNull: true
    }, {
        name: 'phoneMobile',
        allowNull: true
    }, {
        name: 'email',
        allowNull: true
    }, {
        name: 'routePlanning',
        allowNull: true
    }, {
        name: 'type',
        allowNull: true
    }, {
        name: 'lastMod',
        type: 'date'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }]
});
