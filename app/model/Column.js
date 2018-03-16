/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for generic Columns configuration in queryui panel
 */
Ext.define('Lada.model.Column', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'dataType'
    }, {
        name: 'dataIndex'
    }, {
        name: 'sort'
    }, {
        name: 'filter'
    }, {
        name: 'filteractive'
    }],
    idProperty: 'dataIndex'
});
