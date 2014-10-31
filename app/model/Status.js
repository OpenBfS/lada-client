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
    extend: 'Lada.model.Base',
    fields: [
        {name: "id"},
        {name: "messungsId"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "status", defaultValue: 1},
        {name: "datum", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "kommentar"}
    ],
    idProperty: "id",
    proxy: {
        type: 'rest',
        url: 'server/rest/status',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
