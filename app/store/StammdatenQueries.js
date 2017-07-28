/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Queries for Stammdaten
 */
Ext.define('Lada.store.StammdatenQueries', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Query',
    autoLoad: true,
/*    data: { data: [
         {id: '0', name: 'MessprogrammKategorie', type: 'MessprogrammKategorie', sql: 'bogus', description: 'bogusBeschr', filters:  []},
         {id: '1', name: 'DatensatzErzeuger', type: 'DatensatzErzeuger', sql: 'bogus', description: 'bogusBeschr', filters:  []}
        ]},*/
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/query/stammdaten',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});

