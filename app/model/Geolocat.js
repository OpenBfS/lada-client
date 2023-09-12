/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Geolocat', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'siteId',
        type: 'int',
        allowNull: true
    }, {
        name: 'sampleId',
        type: 'int'
    }, {
        name: 'typeRegulation',
        allowNull: true
    }, {
        name: 'addSiteText',
        allowNull: true
    }, {
        name: 'poiId',
        allowNull: true
    }, {
        name: 'lastMod',
        type: 'date'
    }, {
        name: 'treeMod',
        type: 'date'
    }, {
        name: 'parentModified',
        type: 'date'
    }]
});
