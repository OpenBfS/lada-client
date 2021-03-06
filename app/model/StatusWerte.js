/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for StatusWerte
 */
Ext.define('Lada.model.StatusWerte', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        persist: false
    }, {
        name: 'wert',
        type: 'string'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/statuswert',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
