/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.StatusVal', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id',
        persist: false
    }, {
        name: 'val',
        type: 'string'
    }]
});
