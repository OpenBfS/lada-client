/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for OrtsZusatz Stammdaten.
 */
Ext.define('Lada.model.OrtsZusatz', {
    extend: 'Ext.data.Model',

    /**
     * Fields are:
     *  - ozsId: The unique identifier (Primary key).
     *  - ortszusatz: The long description.
     */
    fields: [{
        name: 'ozsId'
    }, {
        name: 'ortszusatz'
    }],

    idProperty: 'ozsId',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/ortszusatz',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
