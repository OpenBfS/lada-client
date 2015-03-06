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
Ext.define('Lada.model.Staat', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'staat'
    }, {
        name: 'staatIso'
    }, {
        name: 'staatKurz'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/staat',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
