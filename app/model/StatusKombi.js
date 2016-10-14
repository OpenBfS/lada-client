/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for StatusKombi
 */
Ext.define('Lada.model.StatusKombi', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'stufeId',
        type: 'int'
    }, {
        name: 'stufeId',
        type: 'int'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/statuskombi',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

