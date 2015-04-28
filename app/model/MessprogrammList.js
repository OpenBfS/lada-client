/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A MessprogrammList.
 * This class represents the result list of 'Messprogramme' in the search query
 * */
Ext.define('Lada.model.MessprogrammList', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'readonly'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/messprogramm',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'
        }
    }
});
