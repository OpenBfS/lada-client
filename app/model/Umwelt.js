/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Umweltbereich Stammdaten.
 */
Ext.define('Lada.model.Umwelt', {
    extend: 'Ext.data.Model',

    /**
     * Fields are:
     *  - id: The unique identifer (Primary key)
     *  - beschreibung: The long description.
     *  - umweltBereich:
     *  - mehId:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'beschreibung'
    }, {
        name: 'mehId'
    }, {
        name: 'secMehId'
    }, {
        name: 'umweltBereich'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/umwelt',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
