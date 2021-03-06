/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Messprogramme, it is still used in the
 * {@link Lada.view.window.GenProbenFromMessprogramm} (broken there? TODO)
 */
Ext.define('Lada.store.MessprogrammeList', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.MessprogrammList',
    pageSize: Lada.pagingSize,
    remoteSort: true,
    remoteFilter: true
});
