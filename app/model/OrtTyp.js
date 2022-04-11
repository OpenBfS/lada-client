/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for OrtTyp Stammdaten.
 */
Ext.define('Lada.model.OrtTyp', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - ortTyp: The long description.
     *  - code: short hand as identifier.
     */
    fields: [{
        name: 'id'
    }, {
        name: 'ortTyp'
    }, {
        name: 'code'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/orttyp',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
