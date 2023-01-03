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
Ext.define('Lada.model.MeasFacil', {
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
        name: 'address',
        allowNull: true
    }, {
        name: 'networkId'
    }, {
        name: 'name',
        allowNull: true
    }, {
        name: 'measFacilType',
        allowNull: true
    }, {
        name: 'trunkCode',
        allowNull: true
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
