/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Queries
 */
Ext.define('Lada.model.Query', {
    extend: 'Ext.data.Model',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/query',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    fields: [{
        name: 'id'
    }, {
        name: 'name'
    }, {
        name: 'userId'
    }, {
        name: 'description'
    }, {
        name: 'baseQuery'
        // the linked stamm.query in the database.
    }, {
        name: 'messStellesIds'
    }, {
        name: 'clonedFrom',
        persist: false
    }]
});
