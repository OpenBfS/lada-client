/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model class for Staat Stammdaten
 */
Ext.define('Lada.model.StaStaat', {
    extend: 'Lada.model.Base',

    fields: [{
        name: "id",
        type: 'int'
    }, {
        name: "staat"
    }, {
        name: "staatIso"
    }, {
        name: "staatKurz"
    }],

    idProperty: "id",

    proxy: {
        type: 'rest',
        url: 'server/rest/sta_staat',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
