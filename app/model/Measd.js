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
Ext.define('Lada.model.Measd', {
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
        name: 'descr',
        allowNull: true
    }, {
        name: 'name'
    }, {
        name: 'defColor',
        allowNull: true
    }, {
        name: 'idfExtId',
        allowNull: true
    }, {
        name: 'isRefNucl',
        type: 'boolean'
    }, {
        name: 'eudfNuclId',
        type: 'int',
        allowNull: true
    }, {
        name: 'bvlFormatId',
        allowNull: true
    }]
});
