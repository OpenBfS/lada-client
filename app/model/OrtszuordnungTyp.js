/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for OrtsZusatz Stammdaten.
 */
Ext.define('Lada.model.OrtszuordnungTyp', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - ortstyp: The long description.
     */
    fields: [{
        name: 'id'
    }, {
        name: 'ortstyp'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/ortszuordnungtyp',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
