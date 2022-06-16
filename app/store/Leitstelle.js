/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store Leistelle for leistelle filter. Will not be obtained from server.
 * It is a subset of Messstellen
 */
Ext.define('Lada.store.Leitstelle', {
    extend: 'Lada.store.Messstellen',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    sorters: [{
        property: 'id',
        direction: 'ASC'
    }],
    sortOnLoad: true
});
