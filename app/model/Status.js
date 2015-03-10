/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Status
 */
Ext.define('Lada.model.Status', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'messungsId'
    }, {
        name: 'status'
    }, {
        name: 'sdatum'
    }, {
        name: 'skommentar'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/status',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
