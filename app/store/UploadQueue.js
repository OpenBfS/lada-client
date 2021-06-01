/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
  * Store for UploadQueue. For the life time of a session, asynchronous upload
  * queries may be stored, allowing for displays of the queue and interactions
  * with polling
 */
Ext.define('Lada.store.UploadQueue', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.UploadQueue',
    sorters: [
        {
            property: 'startDate',
            direction: 'DESC'
        }],
    autoLoad: true,
    proxy: {
        type: 'memory'
    }
});
