/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Store for DatensatzErzeuger Stammdaten
 */
Ext.define('Lada.store.DatensatzErzeuger', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.DatensatzErzeuger',
    data: {
        data: {
            id: 1,
            netzbetreiberId: 'F',
            daErzeugerId: 5,
            mstId: '12020',
            bezeichnung: 'ABCDÄ',
            letzteAenderung: new Date()
        }
    }
});
