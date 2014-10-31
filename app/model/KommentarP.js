/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model class for Kommentare
 */
Ext.define('Lada.model.KommentarP', {
    extend: 'Lada.model.Base',

    fields: [{
        name: "id"
    }, {
        name: "probeId"
    }, {
        name: "erzeuger"
    }, {
        name: "datum",
        type: 'date',
        convert: Lada.lib.Helpers.ts2date,
        defaultValue: new Date()
    }, {
        name: "text"
    }],

    idProperty: "id",

    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/kommentar_p',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
