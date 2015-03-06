/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for Messstelle Stammdaten.
 */
Ext.define('Lada.model.Messstelle', {
    extend: 'Ext.data.Model',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - beschreibung: The long description.
     *  - netzbetreiberId:
     *  - messStelle:
     *  - mstTyp:
     *  - amtskennung:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'beschreibung'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'messStelle'
    }, {
        name: 'mstTyp'
    }, {
        name: 'amtskennung'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/messstelle',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
