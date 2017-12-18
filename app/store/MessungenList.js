/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Messungen, it is used in the {@link Lada.view.grid.MessungenList}
 */
Ext.define('Lada.store.MessungenList', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.MessungList',
    pageSize: 50,
    remoteFilter: true,
    remoteSort: true
});
