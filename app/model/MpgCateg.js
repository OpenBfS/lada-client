/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.MpgCateg', {
    extend: 'Lada.model.LadaBase',

    requires: [
        'Lada.model.field.NonBlankString'
    ],

    fields: [{
        name: 'id'
    }, {
        name: 'networkId'
    }, {
        name: 'extId',
        type: 'nonblankstring'
    }, {
        name: 'name',
        type: 'nonblankstring'
    }, {
        name: 'lastMod',
        type: 'date'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }]
});
