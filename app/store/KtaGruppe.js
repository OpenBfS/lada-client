/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for KtaGruppe
 */
Ext.define('Lada.store.KtaGruppe', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.NuclFacilGr',
    sorters: [
        {
            property: 'extId',
            direction: 'ASC'
        }],
    autoLoad: true,
    sortOnLoad: true
});
