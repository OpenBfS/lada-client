/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Verwaltungseinheit Stammdaten.
 */
Ext.define('Lada.model.Verwaltungseinheit', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'bundesland'
    }, {
        name: 'kreis',
        allowNull: true
    }, {
        name: 'regbezirk',
        allowNull: true
    }, {
        name: 'bezeichnung'
    }, {
        name: 'isBundeland',
        type: 'boolean'
    }, {
        name: 'isGemeinde',
        type: 'boolean'
    }, {
        name: 'isLandkreis',
        type: 'boolean'
    }, {
        name: 'isRegbezirk',
        type: 'boolean'
    }, {
        name: 'plz',
        allowNull: true
    }, {
        name: 'longitude',
        type: 'float',
        allowNull: true
    }, {
        name: 'latitude',
        type: 'float',
        allowNull: true
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/verwaltungseinheit',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
