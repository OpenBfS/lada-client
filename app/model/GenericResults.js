/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for Datenbasis Stammdaten.
 */
Ext.define('Lada.model.GenericResults', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/universal',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
