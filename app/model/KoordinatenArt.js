/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for KoordinatenArt Stammdaten.
 */
Ext.define('Lada.model.KoordinatenArt', {
    extend: 'Ext.data.Model',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - idfGeoKey: The long description.
     *  - koordinatenart:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'idfGeoKey'
    }, {
        name: 'koordinatenart'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/koordinatenart',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
