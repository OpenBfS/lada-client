/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for Netzbetreiber Stammdaten.
 */
Ext.define('Lada.model.Netzbetreiber', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - netzbetreiber:
     *  - idfNetzbetreiber:
     *  - isBmn:
     *  - mailverteiler:
     *  - aktiv:
     *  - zustMstId:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'netzbetreiber'
    }, {
        name: 'idfNetzbetreiber'
    }, {
        name: 'isBmn'
    }, {
        name: 'mailverteiler'
    }, {
        name: 'aktiv'
    }, {
        name: 'zustMstId'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/netzbetreiber',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
