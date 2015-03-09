/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Messwerte
 */
Ext.define('Lada.model.Messwert', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'messungsId'
    }, {
        name: 'messgroesseId'
    }, {
        name: 'messwert',
        type: 'float'
    }, {
        name: 'messwertNwg'
    }, {
        name: 'messfehler',
        type: 'float'
    }, {
        name: 'nwgZuMesswert',
        type: 'float'
    }, {
        name: 'mehId'
    }, {
        name: 'grenzwertueberschreitung',
        type: 'boolean'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date();
        },
        defaultValue: new Date()
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/messwert',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
