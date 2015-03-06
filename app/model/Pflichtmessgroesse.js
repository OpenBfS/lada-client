/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Pflichtmessgroesse Stammdaten.
 */
Ext.define('Lada.model.Pflichtmessgroesse', {
    extend: 'Ext.data.Model',

    /**
     * Fields are:
     *  - id: The unique identifer (Primary key)
     *  - messgroesseId:
     *  - mmtId:
     *  - umwId:
     *  - datenbasisId:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'messgroesseId'
    }, {
        name: 'mmtId'
    }, {
        name: 'umwId'
    }, {
        name: 'datenbasisId'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/pflichtmessgroesse',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
