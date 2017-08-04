/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Kommentare on Messungen
 */
Ext.define('Lada.model.MKommentar', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        persist: false
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'messungsId'
    }, {
        name: 'mstId'
    }, {
        name: 'datum',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        }
    }, {
        name: 'text'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/mkommentar',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
