/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Proben, it is used in the {@link Lada.view.grid.ProbeList}
 */
Ext.define('Lada.store.ProbenList', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.ProbeList',
    pageSize: Lada.pagingSize,
    remoteFilter: true,
    remoteSort: true
});
