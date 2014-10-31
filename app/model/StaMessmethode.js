/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model for Messmethode Stammdaten.
 */
Ext.define('Lada.model.StaMessmethode', {
    extend: 'Ext.data.Model',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - beschreibung: The long description.
     *  - messmethode: 
     */
    fields: [{
        name: 'id'
    }, {
        name: 'beschreibung'
    }, {
        name: 'messmethode'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'server/rest/sta_messmethode',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

