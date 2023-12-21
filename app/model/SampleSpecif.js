/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.SampleSpecif', {
    extend: 'Lada.model.ValidatedModel',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'name'
    }, {
        name: 'unitId',
        type: 'int',
        allowNull: true
    }, {
        name: 'extId'
    }, {
        name: 'eudfKeyword',
        allowNull: true
    }]
});
