/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for OrtTyp
 */
Ext.define('Lada.store.OrtTyp', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.SiteClass',

    data: [{
        id: 1,
        extId: 'DYN'
    }, {
        id: 2,
        extId: 'GP'
    }, {
        id: 3,
        extId: 'REI'
    }, {
        id: 4,
        extId: 'VE'
    }, {
        id: 5,
        extId: 'ST'
    }]
});
