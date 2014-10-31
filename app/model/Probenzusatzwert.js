/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model class for Probenzusatzwert
 */
Ext.define('Lada.model.Probenzusatzwert', {
    extend: 'Lada.model.Base',

    fields: [{
        name: "id"
    }, {
        name: "mehId"
    }, {
        name: "beschreibung"
    }, {
        name: "zusatzwert"
    }, {
        name: "eudfKeyword"
    }],

    idProperty: "id",

    proxy: {
        type: 'rest',
        url: 'server/rest/sta_probenzusatz',
        autoload: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
