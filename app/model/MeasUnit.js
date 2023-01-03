/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for Messeinheit Stammdaten.
 */
Ext.define('Lada.model.MeasUnit', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - beschreibung: The long description.
     *  - einheit: The unit.
     *  - eudfMesseinheitId:
     *  - umrechnungsFaktorEudf:
     *  - primary: True if messeinheit is the primary messeinheit
     */
    fields: [{
        name: 'id'
    }, {
        name: 'name'
    }, {
        name: 'unitSymbol'
    }, {
        name: 'eudfUnitId'
    }, {
        name: 'eudfConversFactor',
        type: 'float'
    }, {
        name: 'primary',
        type: 'boolean',
        persist: false
    }]
});
