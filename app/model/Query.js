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
    extend: 'Lada.model.LadaBase',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/query',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    },

    fields: [{
        name: 'id'
    }, {
        name: 'name'
    }, {
        name: 'userId',
        type: 'int'
    }, {
        name: 'description'
    }, {
        name: 'baseQuery',
        type: 'int'
    }, {
        name: 'messStellesIds'
    }, {
        name: 'clonedFrom',
        persist: false
    }]
});
