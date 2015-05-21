/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Status-Werte
 * TODO i18n
 */
Ext.define('Lada.store.StatusWerte', {
    extend: 'Ext.data.Store',
    fields: ['display', 'id'],
    data: [{
            display: 'unbekannt', id: 0
        }, {
            display: 'nicht vergeben', id: 1
        }, {
            display: 'plausibel', id: 2
        }, {
            display: 'nicht repräsentativ', id: 3
        }, {
            display: 'nicht plausibel', id: 4
        }]
});
