/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Store for Messgroessen
 */
Ext.define('Lada.store.Messgroessen', {
    extend: 'Ext.data.Store',
    fields: ['messgroesseId', 'messgroesse'],
    sorters: [{
        property: 'messgroesse',
        transform: function(val) {
            if (val) {
                return val.toLowerCase();
            } else {
                return "";
            };
        }
    }],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/messgroesse'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
