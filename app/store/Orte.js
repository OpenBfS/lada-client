/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Orte details
 */
Ext.define('Lada.store.Orte', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Site',
    sorters: [{
        property: 'extId',
        direction: 'ASC'
    }],
    remoteFilter: true,
    autoLoad: false,

    // Special proxy with paging ability for Lada.view.grid.Orte
    proxy: {
        type: 'rest',
        url: Lada.model.LadaBase.schema.getUrlPrefix() + '/site',
        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
