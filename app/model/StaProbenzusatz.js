/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model class for Probenzusatz Stammdaten.
 */
Ext.define('Lada.model.StaProbenzusatz', {
    extend: 'Ext.data.Model',

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
        name: 'beschreibung'
    }, {
        name: 'mehId',
        type: 'int'
    }, {
        name: 'zusatzwert'
    }, {
        name: 'eudfKeyword'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'server/rest/sta_probenzusatz',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
