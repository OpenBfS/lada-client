/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for ProbenZusatz Stammdaten.
 */
Ext.define('Lada.model.ProbenZusatz', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - id: The unique identifer (Primary key)
     *  - beschreibung: The long description.
     *  - mehId:
     *  - zusatzwert:
     *  - eudfKeyword:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'beschreibung'
    }, {
        name: 'messEinheitId',
        type: 'int',
        allowNull: true
    }, {
        name: 'zusatzwert'
    }, {
        name: 'eudfKeyword',
        allowNull: true
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/probenzusatz',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});
