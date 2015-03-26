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
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'messungsId'
    }, {
        name: 'erzeuger'
    }, {
        name: 'datum',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        defaultValue: new Date()
    }, {
        name: 'text'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/mkommentar',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
