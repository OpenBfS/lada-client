/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Store for Info
 */
Ext.define('Lada.store.Info', {
    extend: 'Ext.data.Store',

    fields: [
        'user',
        'groups',
        'version'
    ],

    proxy: {
         type: 'rest',
         url: 'server/rest/info',
         reader: {
             type: 'json',
             root: 'data'
         }
     }
});

