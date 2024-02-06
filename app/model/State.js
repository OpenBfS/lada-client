/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.State', {
    requires: [
        'Lada.model.field.NonBlankString'
    ],
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'ctry',
        type: 'nonblankstring'
    }, {
        name: 'iso3166',
        allowNull: true,
        type: 'nonblankstring'
    }]
});
