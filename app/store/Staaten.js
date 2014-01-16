/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Store for Staaten
 */
Ext.define('Lada.store.Staaten', {
    extend: 'Ext.data.Store',
    sorters: [{
        property: 'staat'
    }],
    model: 'Lada.model.Staat',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/staat'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
