/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for generic Columns configuration
 */
Ext.define('Lada.model.Column', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id'
    }, {
        name: 'dataIndex'
    }, {
        name: 'dataType'
    }, {
        name: 'filter'
    }, {
        name: 'name'
    }, {
        name: 'position'
    }, {
        name: 'query'
    }, {
        name: 'gridColumnValues'
    }],
    idProperty: 'id'
});
