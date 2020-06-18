/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
  * Store for DownloadQueue. For the life time of a session, lada-print jobs
  * will be stored, allowing for displays of the queue and interactions with
  * mapfish print polling
 */
Ext.define('Lada.store.DownloadQueue', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.DownloadQueue',
    sorters: [
        {
            property: 'startDate',
            direction: 'DESC'
        }],
    autoLoad: true
});
