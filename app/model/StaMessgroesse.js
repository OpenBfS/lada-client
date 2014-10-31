/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model for Messgroesse Stammdaten.
 */
Ext.define('Lada.model.StaMessgroesse', {
    extend: 'Ext.data.Model',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - beschreibung: The long description.
     *  - defaultFarbe:
     *  - idfNuklidKey:
     *  - istLeitNuklid:
     *  - eudfNuklidId:
     *  - kennungBvl:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'beschreibung'
    }, {
        name: 'messgroesse'
    }, {
        name: 'defaultFarbe'
    }, {
        name: 'idfNuklidKey'
    }, {
        name: 'istLeitNuklid'
    }, {
        name: 'eudfNuklidId'
    }, {
        name: 'kennungBvl'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'server/rest/sta_messgroesse',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

