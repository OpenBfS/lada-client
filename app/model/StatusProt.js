/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.StatusProt', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'measmId',
        type: 'int'
    }, {
        name: 'measFacilId'
    }, {
        name: 'statusComb',
        type: 'int'
    }, {
        name: 'statusVal',
        persist: false
    }, {
        name: 'statusLev',
        persist: false
    }, {
        name: 'treeMod',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'parentModified',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'date',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'text'
    }]
});
