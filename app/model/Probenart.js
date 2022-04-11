/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Probenart Stammdaten.
 */
Ext.define('Lada.model.Probenart', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - id: The unique identifer (Primary key)
     *  - beschreibung: The long description.
     *  - probenart:
     *  - probenartEudfId:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'beschreibung'
    }, {
        name: 'probenart'
    }, {
        name: 'probenartEudfId'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/probenart',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
