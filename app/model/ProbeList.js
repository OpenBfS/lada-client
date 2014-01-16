/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * A ProbeList.
 * This class represents the result list of "Proben" in the search query
 * */
Ext.define('Lada.model.ProbeList', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "readonly"}
    ],
    idProperty: "probeId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/proben',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
