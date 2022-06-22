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
    extend: 'Lada.model.LadaBase',

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
        name: 'id',
        persist: true
    }, {
        name: 'beschreibung',
        allowNull: true
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'messStelle',
        allowNull: true
    }, {
        name: 'mstTyp',
        allowNull: true
    }, {
        name: 'amtskennung',
        allowNull: true
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/messstelle',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
