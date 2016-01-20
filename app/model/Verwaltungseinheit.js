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
    extend: 'Ext.data.Model',

    /**
     * Fields are:
     *  - id: The unique identifer (Primary key)
     *  - beschreibung: The long description.
     *  - umweltBereich:
     *  - mehId:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'bundeland'
    }, {
        name: 'kdaId'
    }, {
        name: 'kreis'
    }, {
        name: 'nuts'
    }, {
        name: 'regbezirk'
    }, {
        name: 'bezeichnung'
    }, {
        name: 'isBundeland'
    }, {
        name: 'isGemeinde'
    }, {
        name: 'isLandkreis'
    }, {
        name: 'isRegbezirk'
    }, {
        name: 'koordXExtern'
    }, {
        name: 'koordYExtern'
    }, {
        name: 'plz'
    }, {
        name: 'longitude'
    }, {
        name: 'latitude'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/verwaltungseinheit',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
