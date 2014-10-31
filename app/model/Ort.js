/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model class for Ort
 */
Ext.define('Lada.model.Ort', {
    extend: 'Lada.model.Base',

    fields: [{
        name: "id",
        type: 'int'
    }, {
        name: "ortId",
        type: 'int'
    }, {
        name: "probeId"
    }, {
        name: "ortsTyp"
    }, {
        name: "ortszusatztext"
    }, {
        name: "letzteAenderung",
        type: 'date',
        convert: Lada.lib.Helpers.ts2date,
        defaultValue: new Date()
    }],

    idProperty: "id",

    proxy: {
        type: 'rest',
        url: 'server/rest/ort',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
