/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class representing a SollIstMmtGruppe
 */
Ext.define('Lada.model.SollIstMmtGruppe', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'bezeichnung'
    }, {
        name: 'beschreibung'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/sollistmmtgruppe',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});

