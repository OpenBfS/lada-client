/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model class for Staat
 */
Ext.define('Lada.model.Staat', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "staatId", type: 'int'},
        {name: "staat"},
        {name: "staatIso"},
        {name: "staatKurz"}
    ],
    idProperty: "staatId",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/staat',
        api: {
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
