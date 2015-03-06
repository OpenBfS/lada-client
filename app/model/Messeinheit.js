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
Ext.define('Lada.model.Messeinheit', {
    extend: 'Ext.data.Model',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - beschreibung: The long description.
     *  - einheit: The unit.
     *  - eudfMesseinheitId:
     *  - umrechnungsFaktorEudf:
     */
    fields: [{
        name: 'id'
    }, {
        name: 'beschreibung'
    }, {
        name: 'einheit'
    }, {
        name: 'eudfMesseinheitId'
    }, {
        name: 'umrechnungsFaktorEudf'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/messeinheit',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
