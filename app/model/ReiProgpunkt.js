/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class representing a Rei-Programmpunkt
 */
Ext.define('Lada.model.ReiProgpunkt', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'reiid'
    }, {
        name: 'reiProgPnkt'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/reiprogpunkt',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});

