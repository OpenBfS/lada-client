/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for Messgroesse Stammdaten.
 */
Ext.define('Lada.model.Messgroesse', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - beschreibung: The long description.
     *  - defaultFarbe:
     *  - idfNuklidKey:
     *  - istLeitNuklid:
     *  - eudfNuklidId:
     *  - kennungBvl:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'beschreibung',
        allowNull: true
    }, {
        name: 'messgroesse'
    }, {
        name: 'defaultFarbe',
        allowNull: true
    }, {
        name: 'idfNuklidKey',
        allowNull: true
    }, {
        name: 'istLeitNuklid',
        type: 'boolean'
    }, {
        name: 'eudfNuklidId',
        type: 'int',
        allowNull: true
    }, {
        name: 'kennungBvl',
        allowNull: true
    }],

    idProperty: 'id'
    // other models contain the proxy-configuration at this point.
    // we don't. You can find the Proxy in in the Store: Lada.store.Messgroessen
});
