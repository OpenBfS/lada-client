/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.QueryUser', {
    requires: [
        'Lada.model.field.NonBlankString'
    ],
    extend: 'Lada.model.ValidatedModel',
    autoLoad: true,

    fields: [{
        name: 'id'
    }, {
        name: 'name'
    }, {
        name: 'ladaUserId',
        type: 'int'
    }, {
        name: 'descr',
        type: 'nonblankstring'
    }, {
        name: 'baseQueryId',
        type: 'int'
    }, {
        name: 'messStellesIds'
    }, {
        name: 'clonedFrom',
        persist: false
    }]
});
