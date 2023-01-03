/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for Kta Stammdaten.
 */
Ext.define('Lada.model.NuclFacil', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - bezeichnung: The long description.
     *  - code: human readable identifer
     */
    fields: [{
        name: 'id'
    }, {
        name: 'name'
    }, {
        name: 'extId'
    }]
});
