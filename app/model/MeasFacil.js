/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.MeasFacil', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id',
        persist: true
    }, {
        name: 'address',
        allowNull: true
    }, {
        name: 'networkId'
    }, {
        name: 'name',
        allowNull: true
    }, {
        name: 'measFacilType',
        allowNull: true
    }, {
        name: 'trunkCode',
        allowNull: true
    }]
});
